import React from "react";
import { Link } from "react-router";

import "./ContentCard.scss";
import type { ContentItem } from "../pages/contentDetails/constants";
import {
  AccessTime,
  PlayArrow,
  TrendingDown,
  TrendingUp,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

interface ContentCardProps {
  content: ContentItem;
  index: number;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, index }) => {
  return (
    <Link to={`/content/${index}`} className="contentCard_card">
      <div className="contentCard_imageWrapper">
        <img
          src={content.videoImage}
          alt={content.name}
          className="contentCard_image"
        />
        <div className="contentCard_gradientOverlay">
          <div className="contentCard_description">
            {content.description}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "8px",
              }}
            >
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
        <div className="contentCard_genreBadges">
          <div className="contentCard_genreBadge">{content.genre[0]}</div>
          {content?.genre?.length > 2 && content?.genre[1] && (
            <div className="contentCard_genreBadge">{content.genre[1]}</div>
          )}
          {content?.genre?.length - 2 > 0 && (
            <div className="contentCard_genreBadge">
              +
              {content?.genre?.length - 2 > 0 ? content?.genre?.length - 2 : ""}
            </div>
          )}
        </div>

        <div className="contentCard_duration">
          <AccessTime className="contentCard_durationIcon" />
          <span>{Math.floor(content.duration / 60)}m</span>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
