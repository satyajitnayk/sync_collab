package handlers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var (
	clientsContext = make(map[*websocket.Conn]WebSocketContext)

	clients   = make(map[*websocket.Conn]bool)
	broadcast = make(chan Message)
	upgrader  = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

type WebSocketContext struct {
	Username   string
	ChatroomId string
}

type Message struct {
	Username   string `json:"username"`
	Content    string `json:"content"`
	ChatroomId string `json:"chatroomId"`
}

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
