package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

type User struct {
	ID        string    `json:"id" db:"id"`
	Email     string    `json:"email" db:"email"`
	FullName  string    `json:"full_name" db:"full_name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type CreateUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	FullName string `json:"full_name" binding:"required"`
}

var dbpool *pgxpool.Pool

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Println("Could not load .env file, using environment variables")
	}

	dbpool, err = connectToDB()
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer dbpool.Close()

	log.Println("Successfully connected to PostgreSQL!")
	// Run a simple query to prove connection
	var greeting string
	err = dbpool.QueryRow(context.Background(), "select 'PostgreSQL connection successful!'").Scan(&greeting)
	if err != nil {
		log.Fatalf("Ping query failed: %v", err)
	}
	log.Println(greeting)

	r := gin.Default()
	r.GET("/health", healthCheckHandler)
	r.POST("/users", createUserHandler)
	// Add other CRUD endpoints here

	log.Println("User Profile service starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func connectToDB() (*pgxpool.Pool, error) {
	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_DB"))

	config, err := pgxpool.ParseConfig(dbUrl)
	if err != nil {
		return nil, err
	}

	// In a production environment, you would want to configure these settings.
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = 30 * time.Minute

	return pgxpool.NewWithConfig(context.Background(), config)
}

func healthCheckHandler(c *gin.Context) {
	// A more robust health check would ping the database.
	if err := dbpool.Ping(context.Background()); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"status": "error", "message": "database connection failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok", "database": "connected"})
}

func createUserHandler(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// For MVP, we are not creating the table.
	// This will fail until migrations are added.
	// This code is illustrative of the connection.
	log.Printf("Received request to create user: %+v. NOTE: This will fail as the 'users' table does not exist yet.", req)
	c.JSON(http.StatusNotImplemented, gin.H{
		"message": "User creation endpoint is defined, but database migration is required to create the 'users' table.",
	})
}
