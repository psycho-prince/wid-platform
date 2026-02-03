package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

// For MVP, we'll store users in memory. In a real app, use a database.
var users = make(map[string][]byte)
var jwtKey []byte

type Credentials struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func main() {
	err := godotenv.Load("../../.env") // Load .env file from root
	if err != nil {
		log.Println("Could not load .env file, using environment variables")
	}

	jwtKey = []byte(os.Getenv("JWT_SECRET"))
	if len(jwtKey) == 0 {
		log.Fatal("JWT_SECRET environment variable not set")
	}

	r := gin.Default()

	r.GET("/health", healthCheckHandler)
	r.POST("/signup", signupHandler)
	r.POST("/login", loginHandler)

	log.Println("Auth service starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func healthCheckHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func signupHandler(c *gin.Context) {
	var creds Credentials
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// For MVP, just store in memory. Check for existing user.
	if _, ok := users[creds.Username]; ok {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	users[creds.Username] = hashedPassword
	log.Printf("User %s signed up.", creds.Username)

	// In a real app, you'd likely create a user record in the user-profile-service
	// via an async event or direct API call.

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func loginHandler(c *gin.Context) {
	var creds Credentials
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	storedPassword, ok := users[creds.Username]
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword(storedPassword, []byte(creds.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	// --- JWT Generation ---
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &jwt.RegisteredClaims{
		Subject:   creds.Username,
		ExpiresAt: jwt.NewNumericDate(expirationTime),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		Issuer:    "wid-auth-service",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	log.Printf("User %s logged in.", creds.Username)

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}
