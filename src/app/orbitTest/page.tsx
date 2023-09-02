
export default function OrbitTest() {
  return (
    <main className=" h-screen bg-black flex justify-center items-center">
      <div className=" text-black bg-white rounded-[50%] sm:p-80 p-40  relative aspect-square flex justify-center items-center ">
        <div className=" border-2 rounded-[50%] aspect-square w-[85%] absolute"></div>
        <div className=" border-2 rounded-[50%] aspect-square w-[65%] absolute"></div>
        <div className=" border-2 rounded-[50%] aspect-square w-[45%] absolute">
            <div className="bg-red-500 rounded-[50%] p-4 aspect-square absolute sm:bottom-16 bottom-3" />
        </div>
        <div className=" border-2 rounded-[50%] aspect-square w-[25%] absolute"></div>
      </div>
    </main>
  );
}
