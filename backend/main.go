package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type WebSocketContext struct {
	Username   string
	ChatroomId string
}

var clientsContext = make(map[*websocket.Conn]WebSocketContext)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Username   string `json:"username"`
	Content    string `json:"content"`
	ChatroomId string `json:"chatroomId"`
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan Message)

func HandleWebsocketConnection(ctx *gin.Context) {
	ws, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer ws.Close()

	// Extract the username and chatroom ID from query parameters
	username := ctx.Query("username")
	chatroomId := ctx.Query("chatroomId")

	if username == "" || chatroomId == "" {
		fmt.Println("Invalid username or chatroom ID")
		return
	}

	// Store username and chatroom ID in the map
	clientsContext[ws] = WebSocketContext{Username: username, ChatroomId: chatroomId}

	// Notify all clients in the same chatroom about the new user, except the current user
	for client, clientContext := range clientsContext {
		if client != ws && clientContext.ChatroomId == chatroomId {
			err := client.WriteJSON(Message{Username: username, Content: "joined the chat", ChatroomId: chatroomId})
			if err != nil {
				log.Printf("error %v", err)
				client.Close()
				delete(clientsContext, client)
			}
		}
	}

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			fmt.Printf("error: %v", err)
			delete(clientsContext, ws)

			// Notify all clients in the same chatroom about the user leaving
			for client, clientContext := range clientsContext {
				if clientContext.ChatroomId == chatroomId {
					err := client.WriteJSON(Message{Username: username, Content: "left the chat", ChatroomId: chatroomId})
					if err != nil {
						log.Printf("error %v", err)
						client.Close()
						delete(clientsContext, client)
					}
				}
			}

			return
		}
		broadcast <- msg
	}
}

func HandleMessages() {
	for {
		msg := <-broadcast
		// Extract chatroom ID from the message
		chatroomId := msg.ChatroomId

		// Iterate over clients in the same chatroom
		for client, clientContext := range clientsContext {
			if clientContext.ChatroomId == chatroomId {
				err := client.WriteJSON(msg)
				if err != nil {
					log.Printf("error %v", err)
					client.Close()
					delete(clientsContext, client)
				}
			}
		}
	}
}

func main() {
	fmt.Println("Starting the Golang server...")

	router := gin.Default()

	// config cors middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "OPTIONS"}
	router.Use(cors.New(config))

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, Golang Server!",
		})
	})

	router.GET("/ws", HandleWebsocketConnection)

	go HandleMessages()

	err := router.Run(":8080")
	if err != nil {
		fmt.Println("Error starting the server:", err)
	}
}
