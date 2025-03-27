import Row from "$dev/components/Row";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Movie = () => {
  const router = useRouter();
  const { id } = router.query;

  const [movieData, setMovieData] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=680c99274ddab12ffac27271d9445d45&append_to_response=credits,recommendations`
        );
        const data = response.data;
        setMovieData(data); // No need to access `data.data[0]`, just use `data`
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    if (id) {
      fetchMovieData();
    }
  }, [id]);

  // Check if movieData is available and has backdrop_path
  if (!movieData) {
    return (
      <>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-[56px] h-[56px] border-t-2 border-b-2 border-l-2 animate-spin border-[#ffcc00] rounded-full"></div>
      </div>
      </>
    )
  }

  // https://player.autoembed.cc/embed/movie/
  return (
    <>
      <div className="pb-[15px]">
        {/** Player */}
        <div className="w-full aspect-video object-cover">
          <iframe
            src={`https://player.autoembed.cc/embed/movie/${id}`}
            className="w-full mx-auto h-auto aspect-video object-cover"
            allowFullScreen
          />
        </div>

        {/** Info */}
        <div className="mt-6 px-3">
          <h1 className="text-2xl font-bold">
            {movieData.title || movieData.name}
          </h1>
          <label className="text-[12px]">
            ⭐{" "}
            <span className="opacity-65">
              {movieData.vote_average.toFixed(1)}
            </span>
          </label>
          <p className="text-[14px] opacity-65 line-clamp-5 mt-1">
            {movieData.overview}
          </p>
        </div>

        {/** Cast */}
        {movieData.credits && (
          <div className="mt-[36px]">
            <div className="flex items-center justify-between px-2 h-[40px]">
              <h1 className="text-[24px] font-medium">Cast</h1>
            </div>
            {movieData.credits.cast && (
              <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar whitespace-nowrap overflow-hidden">
                {movieData.credits.cast
                  .filter((item) => item.profile_path) // Exclude items with null profile_path
                  .map((item, index) => (
                    <Link href={``} key={index}>
                      <div className="relative w-[150px] h-auto rounded-2xl flex flex-col gap-3">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.profile_path}`}
                          className="w-full h-auto object-cover rounded-2xl"
                          alt={item.name || item.original_name}
                          style={{ aspectRatio: 500 / 750 }}
                        />
                        <div className="px-2">
                          <h1 className="font-bold truncate w-[147px]">
                            {item.name || item.original_name}
                          </h1>
                          <div className="flex items-center text-[12px]">
                            <p className="flex items-center gap-2 truncate">
                              Ch: {item.character}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        )}

        {/** Recommended */}
        {movieData.recommendations && (
          <div className="mt-12">
            <Row
              title={"You might like"}
              rowData={movieData.recommendations}
              type={"movie"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Movie;
