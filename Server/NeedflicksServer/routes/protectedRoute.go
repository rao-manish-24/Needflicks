package routes

import (
	"github.com/gin-gonic/gin"
	controller "github.com/rao-manish-24/Needflicks/Server/NeedflicksServer/controllers"
	"github.com/rao-manish-24/Needflicks/Server/NeedflicksServer/middleware"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func SetupProtectedRoutes(router *gin.Engine, client *mongo.Client) {
	protected := router.Group("/")
	protected.Use(middleware.AuthMiddleWare())

	protected.GET("/movie/:imdb_id", controller.GetMovie(client))
	protected.POST("/addmovie", controller.AddMovie(client))
	protected.GET("/recommendedmovies", controller.GetRecommendedMovies(client))
	protected.PATCH("/updatereview/:imdb_id", controller.AdminReviewUpdate(client))
}
