import Header from "./Header";
const Home = () => {
    return(
        <div className="h-screen flex flex-col justify-center items-center">
            <Header />
            <div className="flex top-50 left-50 m-15 p-15 font-bold text-xl">
                Made for people. Built for productivity.
            </div>
        </div>
    )
}

export default Home;