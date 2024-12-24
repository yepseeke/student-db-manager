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
	HOST = getEnvWithDefaultLookup("STDB_HOST", "0.0.0.0")
	PORT = getEnvWithDefaultLookup("STDB_PORT", "8080")
	PROXY = getEnvWithDefaultLookup("STDB_PROXY", "127.0.0.1")
	USER = getEnvWithDefaultLookup("STDB_USER", "postgres")
	PASSWORD = getEnvWithDefaultLookup("STDB_PASSWORD", "admin")
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
