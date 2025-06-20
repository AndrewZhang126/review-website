package routes

import (
	"context"
	"net/http"
	"review-website-backend/database"
	"review-website-backend/models"

	"os"
	"strconv"
	"strings"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

func SetupReviewRoutes(r *gin.Engine) {

	r.OPTIONS("/*path", func(c *gin.Context) {
		c.AbortWithStatus(204)
	})

	r.GET("/api/reviews", func(c *gin.Context) {
		var reviews []models.Review
		database.DB.Find(&reviews)
		c.JSON(http.StatusOK, reviews)
	})

	// r.POST("/api/reviews", func(c *gin.Context) {
	// 	var review models.Review
	// 	if err := c.ShouldBindJSON(&review); err != nil {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 		return
	// 	}
	// 	database.DB.Create(&review)
	// 	c.JSON(http.StatusOK, review)
	// })

	//checks if JSON format is error, if so then its unauthorized
	authorized := r.Group("/", AuthMiddleware())

	authorized.DELETE("/api/reviews/:id", func(c *gin.Context) {
		idParam := c.Param("id")
		id, err := strconv.Atoi(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
			return
		}

		// Try to delete review by ID
		result := database.DB.Delete(&models.Review{}, id)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}

		if result.RowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Review deleted"})
	})

	authorized.POST("/api/reviews", func(c *gin.Context) {
		// var review models.Review
		// //converts JSON to review struct
		// if err := c.ShouldBindJSON(&review); err != nil {
		// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		// 	return
		// }
		// database.DB.Create(&review)
		// c.JSON(http.StatusOK, review)
		restaurant := c.PostForm("restaurant")
		comments := c.PostForm("comments")
		rating := c.PostForm("rating")

		// Get image
		file, err := c.FormFile("image")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Image is required"})
			return
		}

		src, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot open image file"})
			return
		}
		defer src.Close()

		cld, err := cloudinary.NewFromParams(
			os.Getenv("CLOUDINARY_CLOUD_NAME"),
			os.Getenv("CLOUDINARY_API_KEY"),
			os.Getenv("CLOUDINARY_API_SECRET"),
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot retrieve config info for image upload"})
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		uploadResp, err := cld.Upload.Upload(ctx, src, uploader.UploadParams{
			Folder:       "review_website",
			ResourceType: "image",
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot upload image"})
			return
		}

		// Create review record
		newReview := models.Review{
			Restaurant: restaurant,
			Rating:     rating,
			Comments:   comments,
			PhotoURL:   transformCloudinaryURL(uploadResp.SecureURL),
		}

		database.DB.Create(&newReview)
		c.JSON(http.StatusOK, newReview)
	})
}

// f_auto
func transformCloudinaryURL(url string) string {
	return strings.Replace(url, "/upload/", "/upload/f_auto/", 1)
}

// get authentication header from request to determine if equal to secret token
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		expected := "Bearer " + os.Getenv("AUTH_TOKEN")
		if token != expected {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		c.Next()
	}
}
