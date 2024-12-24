package handlers

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"reflect"
)

func QueryToObjects[T any](db *sql.DB, query string, destType reflect.Type) ([]T, error) {
	var objects []T

	// Process query
	rows, err := db.Query(query)
	if err != nil {
		msg := fmt.Sprintf("Error executing query: %v", err)
		log.Printf(msg)
		return objects, errors.New(msg)
	}

	// get access to rows and columns
	defer rows.Close()
	columns, err := rows.Columns()
	if err != nil {
		msg := fmt.Sprintf("Error getting columns: %v", err)
		log.Fatalf(msg)
		return objects, errors.New(msg)
	}

	// parse to objects
	for rows.Next() {
		val := reflect.New(destType).Elem()
		values := make([]interface{}, len(columns))

		for i := range columns {
			values[i] = val.Field(i).Addr().Interface()
		}

		err = rows.Scan(values...)
		if err != nil {
			msg := fmt.Sprintf("Error scanning row: %v", err)
			log.Fatalf(msg)
			return objects, errors.New(msg)
		}

		objects = append(objects, val.Interface().(T))
	}

	if err = rows.Err(); err != nil {
		msg := fmt.Sprintf("Rows error: %v", err)
		log.Fatalf(msg)
		return objects, errors.New(msg)
	}

	return objects, nil
}
