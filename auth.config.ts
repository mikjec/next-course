import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
	pages: {
		signIn: '/login', //wykorzystujemy swoją stornę logowania zamiast domyślnej z next-ath
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user //jesli auth zawiera obiekt user to znaczy ze uzytkownik jest zalogowany
			const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') //sprawdzamy czy uzytkownik próbuje dostać się do dashboardu
			if (isOnDashboard) {
				if (isLoggedIn) return true //jest zalogowany i chce wejsc na dashboard - zostaje wpuszczony
				return false // chce wejsc na dashboard ale nie jest zalogowany - strona przekierowuje go na strone logowania
			} else if (isLoggedIn) { //jest zalogowany i chce wejsc na strone logowania - zostaje przekierowany na dashboard
				return Response.redirect(new URL('/dashboard', nextUrl))
			}
			return true //strony publiczne są dostępne dla wszystkich, niezależnie od tego czy są zalogowani czy nie
		},
	},
	providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig //sprawdza czy obiekt authCofngi spelnia wymagania next-auth
