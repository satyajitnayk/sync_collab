package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting the Golang server...")

	router := gin.Default()

	// config cors middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://127.0.0.1:3000"}
	config.AllowMethods = []string{"GET", "POST", "OPTIONS"}
	router.Use(cors.New(config))

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, Golang Server!",
		})
	})

	err := router.Run(":8080")
	if err != nil {
		fmt.Println("Error starting the server:", err)
	}
}
