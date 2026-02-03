package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

func main() {
	authServiceURL, err := url.Parse(getEnv("AUTH_SERVICE_URL", "http://auth-service:8080"))
	if err != nil {
		log.Fatalf("Failed to parse AUTH_SERVICE_URL: %v", err)
	}

	userProfileServiceURL, err := url.Parse(getEnv("USER_PROFILE_SERVICE_URL", "http://user-profile-service:8080"))
	if err != nil {
		log.Fatalf("Failed to parse USER_PROFILE_SERVICE_URL: %v", err)
	}

	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, `{"status":"ok"}`)
	})

	// Reverse proxy for auth service
	authProxy := httputil.NewSingleHostReverseProxy(authServiceURL)
	mux.Handle("/auth/", http.StripPrefix("/auth", authProxy))

	// Reverse proxy for user profile service
	userProfileProxy := httputil.NewSingleHostReverseProxy(userProfileServiceURL)
	mux.Handle("/users/", http.StripPrefix("/users", userProfileProxy))
	// Add more routes for other services here

	log.Println("API Gateway starting on port 8080...")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
