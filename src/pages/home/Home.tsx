import React, { useState, useEffect, useRef } from "react";
import {
  Search as SearchIcon,
  FilterList,
  TrendingUp,
  TrendingDown,
  LockClock,
} from "@mui/icons-material";
import ContentCard from "../../components/ContentCard";
import "./Home.scss";
import type { ContentItem } from "../contentDetails/constants";
import { Box, Grid } from "@mui/material";
import skyCinima from "../../assets/images/Sky_Cinema_PRIMARY_RGB.png";
import skyNormal from "../../assets/images/SM.png";
import apiService from "../../services/ApiService";
import { useSelector } from "react-redux";
import useDebounce from "../../customHooks/useDebounce";
import GenreCarouselRow from "../../components/genreCard/GenreCard";

const Home: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostWatched, setMostWatched] = useState<any>(null);
  const [grouped, setGrouped] = useState<any>({});
  const [searchedMovie, setSearchedMovie] = useState<any>({});
  const query = useSelector((state: any) => state.search.query);
  const debouncedQuery = useDebounce(query, 1000);

  useEffect(() => {
    console.log("debouncedQuery", debouncedQuery);
    setLoading(true);
    if (!debouncedQuery) {
      setSearchedMovie([]); // clear when input is empty
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
  }, [debouncedQuery]);
  useEffect(() => {
    const getMostWatched = (movies: any): any => {
      return movies.reduce((mostWatched: any, current: any) => {
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
    };
    const groupMoviesByGenre = (movies: any): Record<string, any> => {
      const genreMap: Record<string, any> = {};

      movies.forEach((movie: any) => {
        movie.genre.forEach((genre: string) => {
          if (!genreMap[genre]) {
            genreMap[genre] = [];
          }
          genreMap[genre].push(movie);
        });
      });

      return genreMap;
    };
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
          setMostWatched([]);
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

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }
  return (
    <div className="home_container">
      <Box sx={{ bgcolor: "", color: "black", minHeight: "80vh" }}>
        {!debouncedQuery && (
          <Box
            sx={{
              position: "sticky",
              top: 0,
              height: "500px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${mostWatched?.videoImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
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
                    {mostWatched?.genre.map((genre: string, index: number) => (
                      <span key={index}>{genre}</span>
                    ))}
                  </div>
                  <div className="duration">
                    <LockClock fontSize="small" />
                    <span>{Math.floor(mostWatched?.duration / 60)} mins</span>
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
          {!debouncedQuery && (
            <Box
              sx={{
                position: "absolute",
                top: "-140px",
                width: "100%",
                height: "140px",
                background:
                  "linear-gradient(to bottom, #0075be06 0%, #f4f4f4 100%)",
              }}
            />
          )}
          <div className="home_list_container">
            {debouncedQuery ? (
              <>
                <div className="genre_header">
                  Search Result of "{debouncedQuery}"
                </div>
                <Grid container spacing={3}>
                  {searchedMovie.map((item: any, index: number) => (
                    <Grid
                      key={index}
                      container
                      direction="row"
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "stretch",
                      }}
                      size={{ xs: 12, sm: 6, md: 3, lg: 2 }}
                    >
                      <ContentCard key={index} content={item} index={index} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : grouped ? (
              Object.entries(grouped).map((movieContent: any) => (
                <GenreCarouselRow
                  title={movieContent[0]}
                  items={movieContent[1]}
                />
              ))
            ) : (
              <div className="home_empty">
                <p>No content found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </Box>

      {grouped.length === 0 && (
        <div className="home_empty">
          <p>No content found</p>
        </div>
      )}
    </div>
  );
};

export default Home;
