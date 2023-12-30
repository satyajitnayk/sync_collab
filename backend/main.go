package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/satyajitnayk/sync_collab/config"
	"github.com/satyajitnayk/sync_collab/handlers"
)

var startTime time.Time

func main() {
	startTime = time.Now()
	godotenv.Load()

	db, err := config.ConnectDB()
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	// run migrations/create tables
	config.AutoMigrateAllModels(db)

	fmt.Println("Starting the Golang server...")

	router := gin.Default()

	// config cors middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "OPTIONS"}
	router.Use(cors.New(config))

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Hello, Golang Server!",
		})
	})

	router.GET("/ws", func(ctx *gin.Context) {
		handlers.HandleWebsocketConnection(ctx)
	})

	router.POST("/register", func(ctx *gin.Context) {
		handlers.RegisterUser(ctx, db)
	})

	go handlers.HandleMessages()

	serverRunError := router.Run(":8080")
	if serverRunError != nil {
		fmt.Println("Error starting the server:", serverRunError)
	}
}
