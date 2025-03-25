import Row from "$dev/components/Row";
import ShowEpi from "$dev/components/ShowEpi";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Show = () => {
  const router = useRouter();
  const { id } = router.query;

  const [showData, setShowData] = useState(null);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=680c99274ddab12ffac27271d9445d45&append_to_response=credits,recommendations`
        );
        const data = response.data;
        setShowData(data); // No need to access `data.data[0]`, just use `data`
      } catch (error) {
        console.error("Error fetching show data:", error);
      }
    };

    if (id) {
      fetchShowData();
    }
  }, [id]);

  // Check if showData is available and has backdrop_path
  if (!showData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        {/** Seasons & episodes + Player*/}
        <div className="w-full">
          <ShowEpi showData={showData} id={id} />
        </div>

        {/** Info */}
        {/** Info */}
        <div className="mt-6 px-3">
          <h1 className="text-2xl font-bold">
            {showData.title || showData.name}
          </h1>
          <label className="text-[12px]">
            ⭐{" "}
            <span className="opacity-65">
              {showData.vote_average.toFixed(1)}
            </span>
          </label>
          <p className="text-[14px] opacity-65 line-clamp-5 mt-1">
            {showData.overview}
          </p>
        </div>

        {/** Cast */}
        {showData.credits && (
          <div className="mt-[36px]">
            <div className="flex items-center justify-between px-2 h-[40px]">
              <h1 className="text-[24px] font-medium">Cast</h1>
            </div>
            {showData.credits.cast && (
              <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar whitespace-nowrap overflow-hidden">
                {showData.credits.cast
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
        {showData.recommendations && (
          <div className="mt-12">
            <Row
              title={"You might like"}
              rowData={showData.recommendations}
              type={"tv"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Show;
