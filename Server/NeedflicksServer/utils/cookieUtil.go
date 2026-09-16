package utils

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func cookieSecure() bool {
	switch strings.ToLower(strings.TrimSpace(os.Getenv("COOKIE_SECURE"))) {
	case "false", "0", "no":
		return false
	case "true", "1", "yes":
		return true
	default:
		return os.Getenv("RENDER") != "" || gin.Mode() == gin.ReleaseMode
	}
}

func cookieSameSite(secure bool) http.SameSite {
	if secure {
		return http.SameSiteNoneMode
	}
	return http.SameSiteLaxMode
}

func SetAuthCookies(c *gin.Context, accessToken, refreshToken string) {
	secure := cookieSecure()
	sameSite := cookieSameSite(secure)

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		MaxAge:   86400,
		Secure:   secure,
		HttpOnly: true,
		SameSite: sameSite,
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/",
		MaxAge:   604800,
		Secure:   secure,
		HttpOnly: true,
		SameSite: sameSite,
	})
}

func ClearAuthCookies(c *gin.Context) {
	secure := cookieSecure()
	sameSite := cookieSameSite(secure)

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		Secure:   secure,
		HttpOnly: true,
		SameSite: sameSite,
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		Secure:   secure,
		HttpOnly: true,
		SameSite: sameSite,
	})
}
