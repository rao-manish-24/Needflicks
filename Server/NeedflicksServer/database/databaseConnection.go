package database

import (
	"context"
	"log"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
)

func Connect() *mongo.Client {
	// Missing .env is expected on Render — environment variables are injected there.
	_ = godotenv.Load(".env")

	mongoURI := sanitizeMongoURI(os.Getenv("MONGODB_URI"))
	if mongoURI == "" {
		log.Fatal("MONGODB_URI is not set")
	}
	if !strings.HasPrefix(mongoURI, "mongodb://") && !strings.HasPrefix(mongoURI, "mongodb+srv://") {
		log.Fatal("MONGODB_URI must start with mongodb:// or mongodb+srv:// (remove quotes around the value in Render)")
	}

	if parsed, err := url.Parse(mongoURI); err == nil && parsed.Host != "" {
		log.Printf("MongoDB URI loaded successfully (host: %s)", parsed.Host)
	} else {
		log.Println("MongoDB URI loaded successfully")
	}

	clientOptions := options.Client().
		ApplyURI(mongoURI).
		SetConnectTimeout(10 * time.Second).
		SetServerSelectionTimeout(10 * time.Second)

	client, err := mongo.Connect(clientOptions)
	if err != nil {
		log.Fatalf("Failed to create MongoDB client (check MONGODB_URI format and credentials): %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		_ = client.Disconnect(context.Background())
		log.Fatalf("Failed to ping MongoDB (check Atlas IP allowlist 0.0.0.0/0 and credentials): %v", err)
	}

	log.Println("Connected to MongoDB")
	return client
}

func sanitizeMongoURI(raw string) string {
	uri := strings.TrimSpace(raw)
	uri = strings.Trim(uri, `"'`)
	return strings.TrimSpace(uri)
}

func OpenCollection(collectionName string, client *mongo.Client) *mongo.Collection {
	databaseName := os.Getenv("DATABASE_NAME")
	if databaseName == "" {
		databaseName = "needflicks"
	}

	return client.Database(databaseName).Collection(collectionName)
}
