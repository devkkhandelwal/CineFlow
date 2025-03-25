import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const ShowEpi = ({ id, showData }) => {
  const router = useRouter();
  const [showEpisodes, setShowEpisodes] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1); // ✅ Added selected episode state
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchShowEpisodes = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=680c99274ddab12ffac27271d9445d45&language=en-US`
        );
        setShowEpisodes(response.data);
      } catch (error) {
        console.error("Error fetching episodes");
      }
    };

    if (id) fetchShowEpisodes();
  }, [id, selectedSeason]);

  const handleLeftClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleRightClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* ✅ Embedded Video Player (Now Updates Correctly) */}
      <div className="w-full h-auto aspect-video" id="player">
        <iframe
          src={`https://player.autoembed.cc/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`}
          className="w-full h-auto aspect-video object-cover"
          allowFullScreen
        />
      </div>

      {/* Season Selector */}
      <div className="flex items-center justify-between px-4 h-[40px] mt-4">
        {showData.seasons && (
          <select
            className="bg-black text-white border border-gray-700 p-2 rounded-md cursor-pointer"
            onChange={(e) => {
              const seasonNumber = parseInt(e.target.value);
              setSelectedSeason(seasonNumber);
              setSelectedEpisode(1); // ✅ Reset to first episode when changing season
              router.push(`/watch/show?id=${id}&s=${seasonNumber}&ep=1#player`);
            }}
            value={selectedSeason}
          >
            {showData.seasons.map((item) => (
              <option key={item.id} value={item.season_number}>
                Season {item.season_number}
              </option>
            ))}
          </select>
        )}

        {/* <div className="flex items-center gap-3 h-[40px]">
          <button
            onClick={handleLeftClick}
            className="w-[40px] cursor-pointer h-[40px] rotate-90 flex items-center justify-center rounded-full border border-stone-800"
          >
            <ArrowIcon size={20} />
          </button>
          <button
            onClick={handleRightClick}
            className="w-[40px] cursor-pointer scroll-smooth h-[40px] rotate-270 flex items-center justify-center rounded-full border border-stone-800"
          >
            <ArrowIcon size={20} />
          </button>
        </div> */}
      </div>

      {/* Episode Thumbnails */}
      <div className="relative mt-3">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth px-4"
          style={{ scrollbarWidth: "none" }}
        >
          {showEpisodes?.episodes?.map((episode) => (
            <button
              key={episode.id}
              onClick={() => {
                setSelectedEpisode(episode.episode_number); // ✅ Update selected episode
                router.push(
                  `/watch/show?id=${id}&s=${selectedSeason}&ep=${episode.episode_number}#player`
                );
              }}
              className={`relative min-w-[160px] h-[90px] rounded-xl transition-all`}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300/${
                  episode.still_path || showData.backdrop_path
                }`}
                alt={`Episode ${episode.episode_number}`}
                className={`min-w-[160px] h-[90px] rounded-xl object-cover opacity-60 -z-10 ${
                  selectedEpisode === episode.episode_number
                    ? "border-2 border-blue-500"
                    : ""
                } `}
              />
              <h1 className="p-2 text-white absolute z-10 top-1">
                Ep: {episode.episode_number}
              </h1>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowEpi;
