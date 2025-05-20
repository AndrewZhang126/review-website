package models

import "gorm.io/gorm"

type Review struct {
	gorm.Model
	Restaurant string `json:"restaurant"`
	Rating     string `json:"rating"`
	Comments   string `json:"comments"`
	PhotoURL   string `json:"photo"`
}
