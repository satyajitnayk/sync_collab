package models

import "github.com/jinzhu/gorm"

type User struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
}
