import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useParams } from "react-router";
import { LockClock, PlayCircle } from "@mui/icons-material";

import "./ContentDetails.scss";
import { Box } from "@mui/material";
import skyCinima from "../../assets/images/Sky_Cinema_PRIMARY_RGB.png";
import skyNormal from "../../assets/images/SM.png";
import skyGo from "../../assets/images/Sky-Up-Logo.png";
import skyPeacock from "../../assets/images/Peacock-Logo-PNG.png";
import skyNow from "../../assets/images/NOW_Logo_Solid_Gradient_131x42mm_RGB-1.png";
import apiService from "../../services/ApiService";
import GenreCarouselRow from "../../components/genreCard/GenreCard";
import type { Movie } from "../../types/movies";

const ContentDetail: React.FC = () => {
  const { id } = useParams();
  const [content, setContent] = useState<Movie | null>(null);
  const [similarContent, setSimilarContent] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const getSimilarMovies = useCallback(
    (movies: Movie[], targetName: string): Movie[] => {
      const targetMovie = movies.find(
        (m: Movie) =>
          decodeURIComponent(m.name).toLowerCase() ===
          decodeURIComponent(targetName).toLowerCase()
      );
      if (!targetMovie) return [];
      const targetGenres = new Set(targetMovie.genre);
      return movies.filter(
        (m: Movie) =>
          m.name !== targetMovie.name &&
          m.genre.some((g: string) => targetGenres.has(g))
      );
    },
    []
  );

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await apiService("alb90/aieng-tech-test-assets/data");
        const data = response.data;
        const selectedContent = data.find((eachD: Movie) => eachD.name === id);
        const getSimlMovie = getSimilarMovies(data, id ?? "");
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

  const platforms = useMemo(
    () =>
      content
        ? [
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
          ]
        : [],
    [content]
  );

  const renderProgressBar = useCallback(
    (platform: any, index: number) => {
      if (!content) return null;
      const percentage = (platform.current / content.totalViews.total) * 100;
      return (
        <div
          key={index}
          className={`progress ${platform.color}`}
          style={{
            width: `${percentage}%`,
            borderRadius: "unset",
          }}
        ></div>
      );
    },
    [content]
  );

  const renderPlatform = useCallback(
    (platform: any, index: number) => {
      if (!content) return null;
      const percentage = (platform.current / content.totalViews.total) * 100;
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
    },
    [content]
  );

  const MemoGenreCarouselRow = useMemo(
    () => React.memo(GenreCarouselRow),
    [content]
  );

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner" role="status"></div>
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

  return (
    <div className="contentDetails_container">
      <Box className="contentDetails_container_box">
        <Box className="contentDetails_container_header">
          <Box
            className="contentDetails_hero_img"
            sx={{
              backgroundImage: `url(${content?.videoImage})`,
            }}
          ></Box>
        </Box>
        <div className="contentDetails_movie">
          <Box className="contentDetails_gradient" />
          <div className="contentDetails_hero_text ">
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
                <MemoGenreCarouselRow
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
                  {platforms.map(renderProgressBar)}
                </div>
              </div>

              <div className="card">
                <h3>Platform Breakdown</h3>
                <div className="platforms">{platforms.map(renderPlatform)}</div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ContentDetail;
