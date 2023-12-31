package config

import (
	"fmt"
	"log"
	"os"
	"reflect"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/satyajitnayk/sync_collab/models"
)

func ConnectDB() (*gorm.DB, error) {
	// Get database connection parameters from environment variables
	user := os.Getenv("DB_USER")
	dbname := os.Getenv("DB_NAME")
	password := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")

	// Construct the connection string
	dbURI := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable password=%s",
		host, port, user, dbname, password)

	db, err := gorm.Open("postgres", dbURI)
	if err != nil {
		return nil, err
	}

	environment := os.Getenv("ENVIRONMENT")
	if environment == "" {
		environment = "prod"
	}
	// enable logger
	if environment == "dev" {
		db.LogMode(true)
	}

	return db, nil
}

func AutoMigrateAllModels(db *gorm.DB) {
	modelsToMigrate := []interface{}{
		&models.User{},
	}

	for _, model := range modelsToMigrate {
		fmt.Println("Migrating model:", reflect.TypeOf(model))
		if err := db.AutoMigrate(model).Error; err != nil {
			log.Fatal(err)
		}
	}
}
