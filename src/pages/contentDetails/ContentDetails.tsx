import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  LockClock,
  PlayCircle,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";

import "./ContentDetails.scss";
import type { ContentItem } from "./constants";
import { Box } from "@mui/material";
import skyCinima from "../../assets/images/Sky_Cinema_PRIMARY_RGB.png";
import skyNormal from "../../assets/images/SM.png";
import skyGo from "../../assets/images/Sky-Up-Logo.png";
import skyPeacock from "../../assets/images/Peacock-Logo-PNG.png";
import skyNow from "../../assets/images/NOW_Logo_Solid_Gradient_131x42mm_RGB-1.png";
import apiService from "../../services/ApiService";
import GenreCarouselRow from "../../components/genreCard/GenreCard";

const ContentDetail: React.FC = () => {
  const { id } = useParams();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [similarContent, setSimilarContent] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function getSimilarMovies(movies: any, targetName: any): any {
      // Find the target movie
      const targetMovie = movies.find(
        (m: any) =>
          decodeURIComponent(m.name).toLowerCase() ===
          decodeURIComponent(targetName).toLowerCase()
      );

      if (!targetMovie) return [];

      // Get target movie genres
      const targetGenres = new Set(targetMovie.genre);

      // Filter movies with overlapping genres
      return movies.filter(
        (m: any) =>
          m.name !== targetMovie.name &&
          m.genre.some((g: any) => targetGenres.has(g))
      );
    }
    const fetchContent = async () => {
      try {
        const response = await apiService("alb90/aieng-tech-test-assets/data");
        const data = response.data;
        const selectedContent = data.find((eachD: any) => eachD.name === id);
        const getSimlMovie = getSimilarMovies(data, id);
        console.log(getSimlMovie);
        setSimilarContent(getSimlMovie);
        setContent(selectedContent);
      } catch (error) {
        setSimilarContent([]);
        setContent(null);
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="content_loader">
        <div className="content_notfound">
          <h2>Content Not Found</h2>
          <Link to="/">Return to Home</Link>
        </div>
      </div>
    );
  }

  const platforms = [
    {
      name: "Sky Go",
      current: content.totalViews["sky-go"],
      previous: content.prevTotalViews["sky-go"],
      color: "sky",
    },
    {
      name: "Now TV",
      current: content.totalViews["now-tv"],
      previous: content.prevTotalViews["now-tv"],
      color: "now",
    },
    {
      name: "Peacock",
      current: content.totalViews.peacock,
      previous: content.prevTotalViews.peacock,
      color: "peacock",
    },
  ];

  return (
    <div className="contentDetails_container">
      <Box sx={{ bgcolor: "", color: "black", minHeight: "80vh" }}>
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
              backgroundImage: `url(${content?.videoImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          ></Box>
        </Box>
        <div className="contentDetails_movie">
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
          <div className="contentDetails_hero_text">
            <img
              className="provider"
              src={content.provider === "Sky Cinema" ? skyCinima : skyNormal}
            ></img>
            <h1>{content.name}</h1>
            <div className="info">
              <div className="duration">
                <button className="play_btn">
                  <PlayCircle />
                  <span>Play Now</span>
                </button>
                <LockClock fontSize="small" />
                <span>{Math.floor(content.duration / 60)} mins</span>
              </div>
            </div>
          </div>
          <div className="content_container">
            <div className="main">
              <div className="section">
                <h2>Description</h2>
                <p>{content.description}</p>
              </div>

              <div className="section">
                <h2>Genres</h2>
                <div className="genre_list">
                  {content.genre.map((genre: string, index: number) => (
                    <span key={index}>{genre}</span>
                  ))}
                </div>
              </div>
              <div style={{ overflow: "hidden" }}>
                <GenreCarouselRow
                  title={"Similar Movies"}
                  items={similarContent}
                />
              </div>
            </div>

            <div className="sidebar">
              <div
                className="card d-flex"
                style={{
                  flexDirection: "column",
                }}
              >
                <h3>Overall Performance</h3>
                <div className="performance">
                  <div className="views_header">Total Views</div>
                  <div className="views_total">
                    {content.totalViews.total.toLocaleString()}
                  </div>
                </div>
                <div className="progress_bar d-flex">
                  {platforms.map((platform, index) => {
                    const percentage =
                      (platform.current / content.totalViews.total) * 100;
                    return (
                      <div
                        className={`progress ${platform.color}`}
                        style={{
                          width: `${percentage}%`,
                          borderRadius: "unset",
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>

              <div className="card">
                <h3>Platform Breakdown</h3>
                <div className="platforms">
                  {platforms.map((platform, index) => {
                    const percentage =
                      (platform.current / content.totalViews.total) * 100;

                    return (
                      <div key={index} className="platform">
                        <div className="platform_header">
                          <img
                            className={`platform_icon ${platform?.name}`}
                            src={
                              platform?.name === "Sky Go"
                                ? skyGo
                                : platform?.name === "Now TV"
                                ? skyNow
                                : skyPeacock
                            }
                            alt=""
                          />
                          <div className="platform_value">
                            {platform.current.toLocaleString()}
                          </div>
                        </div>

                        <div className="progress_bar">
                          <div
                            className={`progress ${platform.color}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        <div className="platform_percentage">
                          {percentage.toFixed(1)}% of total views
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ContentDetail;
