package main

import (
	"review-website-backend/database"
	"review-website-backend/routes"

	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found — using system environment variables")
	}

	r := gin.Default()
	// r.Use(cors.Default()) // Allow CORS for dev
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://charming-sopapillas-ab56d0.netlify.app"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	database.Connect()
	routes.SetupReviewRoutes(r)

	// r.Run(":8080") // Default localhost:8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Fallback for local dev
	}
	r.Run(":" + port)
}

/*
go mod init review-website-backend
go get github.com/gin-gonic/gin
go get gorm.io/gorm
go get gorm.io/driver/sqlite
go run main.go
*/
