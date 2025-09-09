import { useRef, useState } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ContentCard from "../ContentCard";
import "./GenreCard.scss";

interface Asset {
  assetImage: string;
  description: string;
  duration: number;
  genre: string[];
  name: string;
  prevTotalViews: Record<string, number>;
  provider: string;
  totalViews: Record<string, number>;
  videoImage: string;
}

interface Props {
  title: string;
  items: Asset[];
}

const ITEMS_PER_PAGE = 6;

function GenreCarouselRow({ title, items }: Props) {
  const [hover, setHover] = useState(false);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const handleNext = () => {
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="genre_header">{title}</div>

      {/* Carousel container */}
      {/* <Box sx={{ position: "relative" }}> */}
      <div style={{ position: "relative" }}>
        <Grid
          container
          spacing={2}
          sx={{
            transition: "transform 0.5s ease",
            transform: `translateX(-${page * 60}%)`,
            width: `${
              (items.length && items.length > ITEMS_PER_PAGE
                ? items.length / ITEMS_PER_PAGE
                : 6 / ITEMS_PER_PAGE) * 100
            }%`,
          }}
          wrap="nowrap"
        >
          {items.map((item: any, index) => (
            <Grid
              key={index}
              container
              direction="row"
              sx={{
                justifyContent: "flex-start",
                alignItems: "stretch",
              }}
              size={{ xs: 12, sm: 6, md: 3, lg: 2 }}
              ref={cardRef}
            >
              <ContentCard content={item} index={index} />
            </Grid>
          ))}
        </Grid>
        {page > 0 && hover && (
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              "&:hover": { bgcolor: "#000000cc" },
              zIndex: 3,
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}

        {page < totalPages - 1 && hover && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              zIndex: 3,
            }}
          >
            <ChevronRight />
          </IconButton>
        )}

        {page > 0 && hover && (
          <Box
            sx={{
              position: "absolute",
              top: "-1.5rem",
              left: "-2rem",
              width: `calc(${cardRef?.current?.offsetWidth}px + 2.3rem)`,
              height: "calc(3rem + 100%)",
              background:
                "linear-gradient(to left, transparent 0%, #f4f4f4 80%, #f4f4f4 100%)",
            }}
          />
        )}
        {page < totalPages - 1 && hover && (
          <Box
            sx={{
              position: "absolute",
              top: "-1.5rem",
              right: "-2rem",
              width: `calc(${cardRef?.current?.offsetWidth}px + 2.3rem)`,
              height: "calc(3rem + 100%)",
              background:
                "linear-gradient(to right, transparent 0%, #f4f4f4 80%, #f4f4f4 100%)",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default GenreCarouselRow;
