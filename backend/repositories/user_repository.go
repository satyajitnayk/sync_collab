package repositories

import (
	"github.com/jinzhu/gorm"
	"github.com/satyajitnayk/sync_collab/models"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (ur *UserRepository) Create(user *models.User) error {
	return ur.DB.Create(user).Error
}

func (ur *UserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := ur.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
