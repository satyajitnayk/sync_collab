package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	auth "github.com/satyajitnayk/sync_collab/config"
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
		c.JSON(http.StatusBadRequest, response)
		return
	}

	if request.Name == "" || request.Email == "" || request.Password == "" {
		response := RegisterResponse{ErrorMessage: "name, email & password are required"}
		c.JSON(http.StatusBadRequest, response)
		c.JSON(http.StatusBadRequest, response)
		return
	}

	hashedPassword, err := hashPassword(request.Password)
	if err != nil {
		response := RegisterResponse{ErrorMessage: "Failed to hash password"}
		c.JSON(http.StatusInternalServerError, response)
		return
	}

	user := &models.User{Name: request.Name, Email: request.Email, Password: hashedPassword}

	userRepo := repositories.NewUserRepository(db)

	if err := userRepo.Create(user); err != nil {
		response := RegisterResponse{ErrorMessage: "Failed to create user"}
		c.JSON(http.StatusInternalServerError, response)
		return
	}

	response := RegisterResponse{Message: "User registered successfully"}
	c.JSON(http.StatusCreated, response)
}

func LoginUser(c *gin.Context, db *gorm.DB) {
	var request LoginRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		response := LoginResponse{ErrorMessage: "Invalid login payload"}
		c.JSON(http.StatusBadRequest, response)
		return
	}
	if request.Email == "" || request.Password == "" {
		response := LoginResponse{ErrorMessage: "Email & Password are requied"}
		c.JSON(http.StatusBadRequest, response)
		return
	}

	userRepo := repositories.NewUserRepository(db)

	user, err := userRepo.FindByEmail(request.Email)
	if err != nil {
		response := LoginResponse{ErrorMessage: "Failed to login"}
		c.JSON(http.StatusBadRequest, response)
		return
	}

	// compare password
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)) == nil {
		//jwt
		jwt, err := auth.GenerateJWT(request.Email)
		if err != nil {
			fmt.Print(err)
			response := LoginResponse{ErrorMessage: "Unable to generate token"}
			c.JSON(http.StatusInternalServerError, response)
			return
		} else {
			response := LoginResponse{Token: jwt}
			c.JSON(http.StatusOK, response)
			return
		}
	} else {
		response := LoginResponse{ErrorMessage: "Failed to login"}
		c.JSON(http.StatusUnauthorized, response)
		return
	}
}
