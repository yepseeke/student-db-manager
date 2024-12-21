package config

import (
	"os"
)

var HOST, PORT, PROXY, USER, PASSWORD string

func getEnvWithDefaultLookup(key, defaultValue string) string {
	value, ok := os.LookupEnv(key)
	if !ok {
		return defaultValue
	}
	return value
}

func init() {
	HOST = getEnvWithDefaultLookup("HOST", "0.0.0.0")
	PORT = getEnvWithDefaultLookup("PORT", "8080")
	PROXY = getEnvWithDefaultLookup("PROXY", "127.0.0.1")
	USER = getEnvWithDefaultLookup("USER", "postgres")
	PASSWORD = getEnvWithDefaultLookup("PASSWORD", "admin")
}

func GetHostAndPort() string {
	return HOST + ":" + PORT
}

func GetUser() string {
	return USER
}

func GetPassword() string {
	return PASSWORD
}

func GetProxy() string {
	return PROXY
}
