import Link from "next/link";
import { useRef } from "react";

const Row = ({ title, rowData, type }) => {
  const containerRef = useRef(null);

  const handleLeftClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 300; // (300px)
    }
  };

  const handleRightClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 300; // (300px)
    }
  };

  return (
    <>
      {rowData && (
        <div className="flex flex-col">
          {/** Title & Slide btns */}
          <div className="flex items-center justify-between px-2 h-[40px]">
            <h1 className="text-[24px] font-medium">{title}</h1>
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
          {/** Row Items */}
          {rowData.results && (
            <div
              ref={containerRef}
              className="mt-4 flex px-2 gap-3 overflow-x-auto no-scrollbar whitespace-nowrap overflow-hidden"
            >
              {rowData.results.map(
                (item, index) =>
                  (item.media_type || type) == type && (
                    <Link
                      href={`/${
                        type == "tv"
                          ? `watch/show?id=${item.id}&s=1&ep=1`
                          : `watch/movie?id=${item.id}`
                      }`}
                      key={index}
                    >
                      <div className="relative w-[150px] h-auto rounded-2xl flex flex-col gap-3">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          className="w-full h-auto object-cover rounded-2xl"
                          alt={item.name || item.title}
                          style={{ aspectRatio: 500 / 750 }}
                        />
                        <div className="px-2">
                          <h1 className="font-bold truncate w-[147px]">
                            {item.title || item.name}
                          </h1>
                          <div className="flex items-center justify-between text-[12px]">
                            <p className="flex items-center gap-2">
                              <span className="opacity-65">
                                {new Date(
                                  item.release_date || item.first_air_date
                                ).getFullYear()}
                              </span>
                              <span className="text-[17px]">•</span>
                              <span className="opacity-65">
                                ⭐ {item.vote_average.toFixed(1)}
                              </span>
                            </p>
                            <span className="border border-white px-1 py-0.5 opacity-65 rounded-[5px]">
                              {item.media_type || type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Row;
