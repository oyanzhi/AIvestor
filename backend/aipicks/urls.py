from django.urls import path
from .views import AddWatchlist, RemoveWatchlist, FetchWatchlist, FetchAIRecommendations

urlpatterns = [
    path("addwatchlist/", AddWatchlist.as_view(), name="addwatchlist"),
    path("removewatchlist/", RemoveWatchlist.as_view(), name="removewatchlist"),
    path("fetchwatchlist/", FetchWatchlist.as_view(), name="fetchwatchlist"),
    path(
        "fetchairecommendations/",
        FetchAIRecommendations.as_view(),
        name="fetchairecommendations",
    ),
]
