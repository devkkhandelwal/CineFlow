import Link from "next/link";

const HomePage = () => {
  return (
    <>
      <div>
        <h1>Hello world</h1>
        <Link href={`/watch/movie?id=822119`}>Click me </Link>
        <Link href={`/watch/show?id=94997`}>Click me </Link>
      </div>
    </>
  );
};

export default HomePage;
