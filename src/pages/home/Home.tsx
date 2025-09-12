import React, { useState, useEffect, useMemo, useCallback } from "react";
import { LockClock } from "@mui/icons-material";
import ContentCard from "../../components/ContentCard";
import "./Home.scss";
import { Box, Grid } from "@mui/material";
import skyCinima from "../../assets/images/Sky_Cinema_PRIMARY_RGB.png";
import skyNormal from "../../assets/images/SM.png";
import apiService from "../../services/ApiService";
import { useSelector } from "react-redux";
import useDebounce from "../../customHooks/useDebounce";
import GenreCarouselRow from "../../components/genreCard/GenreCard";
import type { Movie } from "../../types/movies";
import type { RootState } from "../../redux/store";

const Home: React.FC = () => {
  const [content, setContent] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostWatched, setMostWatched] = useState<Movie | null>(null);
  const [grouped, setGrouped] = useState<Record<string, Movie[]>>({});
  const [searchedMovie, setSearchedMovie] = useState<Movie[]>([]);
  const query = useSelector((state: RootState) => state?.search?.query);
  const debouncedQuery = useDebounce(query, 1000);

  const getMostWatched = useCallback((movies: Movie[]): Movie => {
    return movies.reduce((mostWatched: Movie, current: Movie) => {
      const currentTotal =
        typeof current.totalViews.total === "string"
          ? parseInt(current.totalViews.total)
          : current.totalViews.total;
      const mostWatchedTotal =
        typeof mostWatched.totalViews.total === "string"
          ? parseInt(mostWatched.totalViews.total)
          : mostWatched.totalViews.total;
      return currentTotal > mostWatchedTotal ? current : mostWatched;
    });
  }, []);

  const groupMoviesByGenre = useCallback(
    (movies: Movie[]): Record<string, Movie[]> => {
      const genreMap: Record<string, Movie[]> = {};
      movies.forEach((movie: Movie) => {
        movie.genre.forEach((genre: string) => {
          if (!genreMap[genre]) {
            genreMap[genre] = [];
          }
          genreMap[genre].push(movie);
        });
      });
      return genreMap;
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    if (!debouncedQuery) {
      setSearchedMovie([]);
      setLoading(false);
      return;
    }
    const lower = debouncedQuery.toLowerCase();
    const filtered = content.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(lower);
      const matchesGenre = item.genre.some((g) =>
        g.toLowerCase().includes(lower)
      );
      return matchesName || matchesGenre;
    });
    setSearchedMovie(filtered);
    setLoading(false);
  }, [debouncedQuery, content]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await apiService.get(
          "alb90/aieng-tech-test-assets/data"
        );
        const data = await response.data;
        if (data && data?.length > 0) {
          const topMovie = getMostWatched(data);
          setMostWatched(topMovie);
          const groupedGenres = groupMoviesByGenre(data);
          setGrouped(groupedGenres);
        } else {
          setMostWatched(null);
        }
        setContent(data);
      } catch (error) {
        setContent([]);
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const renderSearchedMovies = useCallback(
    () => (
      <>
        <div className="genre_header">Search Result of "{debouncedQuery}"</div>
        <Grid container spacing={3}>
          {searchedMovie.map((item: Movie) => (
            <Grid
              key={item.name}
              container
              direction="row"
              className="home_card_grid"
              size={{ xs: 12, sm: 6, md: 3, lg: 2 }}
            >
              <ContentCard key={item.name} content={item} />
            </Grid>
          ))}
        </Grid>
      </>
    ),
    [debouncedQuery, searchedMovie]
  );

  const renderGroupedGenres = useMemo(
    () =>
      Object.entries(grouped).map(([genre, items]) => (
        <GenreCarouselRow key={genre} title={genre} items={items} />
      )),
    [grouped]
  );

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }
  return (
    <div className="home_container">
      <Box className="home_container_box">
        {!debouncedQuery && (
          <Box className="home_container_header">
            <Box
              sx={{
                backgroundImage: `url(${mostWatched?.videoImage})`,
              }}
              className="home_hero_img"
            >
              <div className="home_hero_text">
                <h1>#Most Watched</h1>
                <h1>
                  {mostWatched?.name}
                  <img
                    className="provider"
                    src={
                      mostWatched?.provider === "Sky Cinema"
                        ? skyCinima
                        : skyNormal
                    }
                  ></img>
                </h1>
                <div className="info">
                  <div className="genre_list">
                    {mostWatched?.genre.map((genre: string) => (
                      <span key={genre}>{genre}</span>
                    ))}
                  </div>
                  <div className="duration">
                    <LockClock fontSize="small" />
                    <span>
                      {mostWatched?.duration !== undefined
                        ? `${Math.floor(mostWatched.duration / 60)} mins`
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <p className="home_hero__description">
                  {mostWatched?.description}
                </p>
              </div>
            </Box>
          </Box>
        )}
        <div className="home_movie_list">
          {!debouncedQuery && <Box className="home_hero_gradient" />}
          <div className="home_list_container">
            {debouncedQuery
              ? renderSearchedMovies()
              : grouped && renderGroupedGenres}
          </div>
        </div>
      </Box>

      {Object.keys(grouped).length === 0 && (
        <div className="home_empty">
          <p>No content found</p>
        </div>
      )}
    </div>
  );
};

export default Home;
