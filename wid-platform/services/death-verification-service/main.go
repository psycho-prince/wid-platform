package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// This is a stubbed service for the MVP.
	r.POST("/verify", func(c *gin.Context) {
		c.JSON(http.StatusNotImplemented, gin.H{"message": "Death verification is a pluggable service and is not implemented in the MVP."})
	})


	log.Println("Death Verification service starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
