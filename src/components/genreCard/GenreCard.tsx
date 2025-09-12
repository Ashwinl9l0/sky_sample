import React, { useRef, useState, useMemo, useCallback } from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ContentCard from "../ContentCard";
import "./GenreCard.scss";
import type { GenreCardProps } from "../../types/movies";

const ITEMS_PER_PAGE = 6;

const GenreCarouselRow: React.FC<GenreCardProps> = ({ title, items }) => {
  const [hover, setHover] = useState(false);
  const [page, setPage] = useState(0);
  const totalPages = useMemo(
    () => Math.ceil(items.length / ITEMS_PER_PAGE),
    [items.length]
  );
  const cardRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNext = useCallback(() => {
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  }, [page, totalPages]);

  const handlePrev = useCallback(() => {
    if (page > 0) setPage((prev) => prev - 1);
  }, [page]);

  const pagedItems = useMemo(() => items, [items]);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="genre_header">{title}</div>
      <div className="genre_grid">
        <Grid
          container
          spacing={2}
          sx={
            !isMobile
              ? {
                  transition: "transform 0.5s ease",
                  transform: `translateX(-${page * 60}%)`,
                  width: `${
                    items.length && items.length > ITEMS_PER_PAGE
                      ? (items.length / ITEMS_PER_PAGE) * 100
                      : (6 / ITEMS_PER_PAGE) * 100
                  }%`,
                }
              : {}
          }
          wrap={isMobile ? "wrap" : "nowrap"}
        >
          {pagedItems.map((item: any, index) => (
            <Grid
              key={item.name || index}
              container
              direction="row"
              className="genre_card_grid"
              size={{ xs: 12, sm: 6, md: 3, lg: 2 }}
              ref={cardRef}
            >
              <ContentCard content={item} />
            </Grid>
          ))}
        </Grid>
        {page > 0 && hover && (
          <IconButton className="genre_leftButton" onClick={handlePrev}>
            <ChevronLeft />
          </IconButton>
        )}

        {page < totalPages - 1 && hover && (
          <IconButton
            onClick={handleNext}
            sx={{}}
            className="genre_rightButton"
          >
            <ChevronRight />
          </IconButton>
        )}

        {page > 0 && hover && (
          <Box
            className="genre_leftFade"
            style={{
              width: `calc(${cardRef?.current?.offsetWidth}px + 2.3rem)`,
            }}
          />
        )}
        {page < totalPages - 1 && hover && (
          <Box
            style={{
              width: `calc(${cardRef?.current?.offsetWidth}px + 2.3rem)`,
            }}
            className="genre_rightFade"
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(GenreCarouselRow);
