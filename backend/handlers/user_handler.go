package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/satyajitnayk/sync_collab/models"
	"github.com/satyajitnayk/sync_collab/repositories"
	"golang.org/x/crypto/bcrypt"
)

type RegisterPayload struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterResponse struct {
	Message      string `json:"message"`
	ErrorMessage string `json:"error,omitempty"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token        string `json:"token,omitempty"`
	ErrorMessage string `json:"error,omitempty"`
}

func sendJsonResponse(w http.ResponseWriter, statusCode int, response interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func RegisterUser(c *gin.Context, db *gorm.DB) {
	var request RegisterPayload
	if err := c.ShouldBindJSON(&request); err != nil {
		response := RegisterResponse{ErrorMessage: "Invalid request payload"}
		sendJsonResponse(c.Writer, http.StatusBadRequest, response)
		return
	}

	if request.Name == "" || request.Email == "" || request.Password == "" {
		response := RegisterResponse{ErrorMessage: "name, email & password are required"}
		sendJsonResponse(c.Writer, http.StatusBadRequest, response)
		return
	}

	hashedPassword, err := hashPassword(request.Password)
	if err != nil {
		response := RegisterResponse{ErrorMessage: "Failed to hash password"}
		sendJsonResponse(c.Writer, http.StatusInternalServerError, response)
		return
	}

	user := &models.User{Name: request.Name, Email: request.Email, Password: hashedPassword}

	userRepo := repositories.NewUserRepository(db)

	if err := userRepo.Create(user); err != nil {
		response := RegisterResponse{ErrorMessage: "Failed to create user"}
		sendJsonResponse(c.Writer, http.StatusInternalServerError, response)
		return
	}

	response := RegisterResponse{Message: "User registered successfully"}
	sendJsonResponse(c.Writer, http.StatusCreated, response)
}
