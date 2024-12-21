package config

import (
	"os"
)

var HOST, PORT, PROXY, DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT string

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
	DB_NAME = getEnvWithDefaultLookup("DB_NAME", "students_registry")
	DB_HOST = getEnvWithDefaultLookup("DB_HOST", "localhost")
	DB_PORT = getEnvWithDefaultLookup("DB_PORT", "5434")
	DB_USER = getEnvWithDefaultLookup("DB_USER", "postgres")
	DB_PASSWORD = getEnvWithDefaultLookup("DB_PASSWORD", "admin")
}

func GetHostAndPort() string {
	return HOST + ":" + PORT
}

func GetUser() string {
	return DB_USER
}

func GetPassword() string {
	return DB_PASSWORD
}

func GetDbName() string {
    return DB_NAME
}

func GetDbHost() string {
    return DB_HOST
}

func GetDbPort() string {
    return DB_PORT
}

func GetProxy() string {
	return PROXY
}
