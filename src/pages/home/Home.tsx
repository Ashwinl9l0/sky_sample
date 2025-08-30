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
import axios from "axios";
import { Box, Grid } from "@mui/material";
import skyCinima from "../../assets/images/Sky_Cinema_PRIMARY_RGB.png";
import skyNormal from "../../assets/images/SM.png";

const Home: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [mostWatched, setMostWatched] = useState<any>(null);
  const [grouped, setGrouped] = useState<any>({});
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
        const response = await axios.get(
          "https://my-json-server.typicode.com/alb90/aieng-tech-test-assets/data"
        );
        const data = await response.data;
        if (data && data?.length > 0) {
          console.log(data);

          const topMovie = getMostWatched(data);
          console.log(topMovie);
          setMostWatched(topMovie);
          const groupedGenres = groupMoviesByGenre(data);
          console.log(Object.entries(groupedGenres));
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

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "all" || item.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

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
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: -1,
            height: "500px",
            overflow: "hidden",
          }}
        >
          <Box
            //if its video
            // component="video"
            // src={
            //   "https://uk.imageservice.sky.com/contentid/764b39c2db1bc510VgnVCM1000000b43150a____/BOXART"
            // }
            // autoPlay
            // muted
            // loop
            // playsInline
            // ref={videoRef}
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
                {mostWatched.name}
                <img
                  className="provider"
                  src={
                    mostWatched.provider === "Sky Cinema"
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
                  <span>{Math.floor(mostWatched.duration / 60)} mins</span>
                </div>
              </div>
              <p className="home_hero__description">
                {mostWatched.description}
              </p>
            </div>
          </Box>
        </Box>
        <div className="home_movie_list">
          <Box
            sx={{
              position: "absolute",
              top: "400px",
              width: "100%",
              height: "140px",
              background:
                "linear-gradient(to bottom, rgba(227, 225, 225, 0) 0%, #f4f4f4 100%)",
            }}
          />
          <div className="home_list_container">
            {grouped ? (
              Object.entries(grouped).map((movieContent: any) => (
                <>
                  <div className="genre_header">{movieContent[0]}</div>
                  <Grid container spacing={3}>
                    {movieContent[1].map((item: any, index: number) => (
                      <Grid
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
          <p>No content found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Home;
