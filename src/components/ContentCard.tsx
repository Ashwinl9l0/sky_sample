import React, { useMemo } from "react";
import { Link } from "react-router";

import "./ContentCard.scss";
import { AccessTime, PlayArrow, VisibilityOutlined } from "@mui/icons-material";
import type { Movie } from "../types/movies";

interface ContentCardProps {
  content: Movie;
}

const ContentCard: React.FC<ContentCardProps> = React.memo(({ content }) => {
  const genreBadges = useMemo(() => {
    if (!content.genre || content.genre.length === 0) return null;
    const badges = [];
    badges.push(
      <div className="contentCard_genreBadge" key={content.genre[0]}>
        {content.genre[0]}
      </div>
    );
    if (content.genre.length > 1) {
      badges.push(
        <div className="contentCard_genreBadge" key="more">
          +{content.genre.length - 1}
        </div>
      );
    }
    return badges;
  }, [content.genre]);

  return (
    <Link to={`/content/${content.name}`} className="contentCard_card">
      <div className="contentCard_imageWrapper">
        <img
          src={content.videoImage}
          alt={content.name}
          className="contentCard_image"
        />
        <div className="contentCard_gradientOverlay">
          <div className="contentCard_description">
            {content.description}
            <div className="contentCard_bottomRow">
              <div className="contentCard_totalView">
                <VisibilityOutlined style={{ fontSize: 12 }} /> &nbsp;&nbsp;
                {content?.totalViews?.total}
              </div>
            </div>
          </div>
        </div>
        <div className="contentCard_playOverlay">
          <div className="contentCard_playButton">
            <PlayArrow className="contentCard_playIcon" />
          </div>
        </div>
        <div className="contentCard_genreBadges">{genreBadges}</div>
        <div className="contentCard_duration">
          <AccessTime className="contentCard_durationIcon" />
          <span>{Math.floor(content.duration / 60)}m</span>
        </div>
      </div>
    </Link>
  );
});

export default ContentCard;
