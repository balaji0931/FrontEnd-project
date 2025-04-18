import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useState } from "react";

export default function MediaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="sticky top-14 md:top-20 z-50 w-full text-sm overflow-hidden bg-black text-white">
        <div className="m-3 flex space-x-3 whitespace-nowrap overflow-x-auto">
          <a href="#seperation" className="p-1 bg-white/50 rounded ">
            Seperation Techniques
          </a>
          <a href="#management" className="p-1 bg-white/50 rounded ">
            Waste Management
          </a>
          <a href="#knowwaste" className="p-1 bg-white/50 rounded ">
            Know your waste
          </a>
          <a href="#composting" className="p-1 bg-white/50 rounded ">
            Organic Composting
          </a>
          <a href="#insights" className="p-1 bg-white/50 rounded ">
            Recyclic Insights
          </a>
          <a href="#living" className="p-1 bg-white/50 rounded ">
            Sustainable Living
          </a>
          <a href="#industry" className="p-1 bg-white/50 rounded ">
            Technology and Industry
          </a>
          <a href="#documentries" className="p-1 bg-white/50 rounded ">
            Documentries
          </a>
          <a href="#documentries" className="p-1 bg-white/50 rounded ">
            Shortfilms
          </a>
          <a href="#expert" className="p-1 bg-white/50 rounded ">
            Expert Insights
          </a>
          <a href="#impact" className="p-1 bg-white/50 rounded ">
            Environmental Impact
          </a>
        </div>
      </div>
      <main className="flex-grow bg-gradient-to-r from-primary to-[#558B2F]">
        <section className="bg-gradient-to-r from-primary to-[#558B2F] text-white py-5 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <h1 className="font-bold text-3xl md:text-4xl mb-4">
                Educational Resources & Community Content
              </h1>
              <p className="text-lg opacity-90">
                Explore our collection of videos, articles, and guides about
                waste management, recycling, and sustainable living. Stay
                informed and learn how to make a positive environmental impact.
              </p>
            </div>
          </div>
        </section>
        <hr></hr>

        <div className="container mx-auto px-4 md:px-6 pt-1 pb-8">
          <div id="management" style={{ scrollMarginTop: "180px" }}>
            <h1 className="text-black font-bold text-xl md:text-3xl text-center bg-white/80 py-2 my-4">
              Waste Management Tutorials
            </h1>
            <div className="flex flex-wrap justify-center">
              <div className="rounded-xl m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/K6ppCC3lboU?si=hTCWttO1IZzpV_wL"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  What is Waste Management? | Reduce Reuse Recycle
                </h1>
              </div>
              <div className="rounded-xl m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/Qyu-fZ8BOnI?si=8dRxk1mnK2nQ3zdV"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Proper Waste Management | How waste reduction and recycling
                  help our environment?
                </h1>
              </div>
            </div>
          </div>
          <div id="seperation" style={{ scrollMarginTop: "180px" }}>
            <h1 className="text-black font-bold text-xl md:text-3xl text-center bg-white/80 py-2 my-4">
              Waste Seperation Techniques
            </h1>
            <div className="flex flex-wrap justify-center">
              <div className="rounded-xl m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/3rojCZCeCDw?si=B1mLEtFLukiAe_xG"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Waste Seperation | Learn How to seperate Waste
                </h1>
              </div>
              <div className="rounded-xl m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/7SCBdcXg2fs?si=hnUa8YG6vA40_E-X"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  How to seperate House Garbage?
                </h1>
              </div>
            </div>
          </div>
          <div id="knowwaste" style={{ scrollMarginTop: "180px" }}>
            <h1 className="text-black font-bold text-xl md:text-3xl text-center bg-white/80 py-2 my-4">
              Know about Your Waste
            </h1>
            <div className="flex flex-wrap justify-center">
              <div className="rounded-xl m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/clWgAJU9bT0?si=GOLfRM5OK-YX_1uk"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Know your waste | Types of waste
                </h1>
              </div>
              <div className="rounded-xl m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/211su80MESk?si=iYIzHZBcTYzpsSZm"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Life cycle of waste | what happens to your waste
                </h1>
              </div>
            </div>
          </div>
          <div id="impact" style={{ scrollMarginTop: "180px" }}>
            <h1 className="text-black font-bold text-xl md:text-3xl text-center bg-white/80 py-2 my-4">
              Environmental Impact
            </h1>
            <div className="flex flex-wrap justify-center">
              <div className="rounded-xl m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/AJVky2Fzl54?si=BqbrmAwpQpADVDNI"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  What happens to our 2.2 billion tons of waste?
                </h1>
              </div>
              <div className="rounded m-2 flex flex-col items-cente pt-2r">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/-uyIzKIw0xY?si=v_MInGRi4NzWo_Hm"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  How e-waste is harming our world
                </h1>
              </div>
            </div>
          </div>
          <div id="expert" style={{ scrollMarginTop: "180px" }}>
            <h1 className="text-black font-bold text-xl md:text-3xl text-center bg-white/80 py-2 my-4">
              Interview & Expert Insights
            </h1>
            <div className="flex flex-wrap justify-center">
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/buBZES0vK4g?si=0RIOiPZApJ1QZK9n"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Interview with Silpa Kaza - Expert in solid waste management
                  with the World Bank
                </h1>
              </div>
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/mIMtmV5iqZo?si=xv1WBVk7LHhqzYTF"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Waste Segregation Expert Interview - Abhijeet Deshpande
                </h1>
              </div>
            </div>
          </div>
          <div id="composting" style={{ scrollMarginTop: "180px" }}>
            <h1 className="text-black font-bold text-xl md:text-3xl text-center bg-white/80 py-2 my-4">
              Composting and organic waste
            </h1>
            <div className="flex flex-wrap justify-center">
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/18_bk-jaOnU?si=1Nm8Uef75KlkUBFH"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  How to Make Compost at Home | Kitchen Waste Compost
                </h1>
              </div>
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/alljc5elqqw?si=jtolP9vLJKCyPoIW"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Four Fascinating Ways to Turn Trash Into Fuel | World Wide
                  Waste
                </h1>
              </div>
            </div>
          </div>
          <div id="insights" style={{ scrollMarginTop: "180px" }}>
            <h1 className="text-black font-bold text-xl md:text-3xl text-center bg-white/80 py-2 my-4">
              Recyclic Insights
            </h1>
            <div className="flex flex-wrap justify-center">
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/1XfXiyejbU4?si=vTH9gcvrTERwZFAg"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Key Recycling Insights You Won't Want to Miss
                </h1>
              </div>
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/OTqgYvNSA4c?si=cvCppUiGwIvZFqVs"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  E-Waste Is Poisoning Malaysia And Thailand - What Can Be Done?
                </h1>
              </div>
            </div>
          </div>
          <div id="living" style={{ scrollMarginTop: "180px" }}>
            <h1 className="text-black font-bold text-xl md:text-3xl text-center bg-white/80 py-2 my-4">
              Sustainable Living Tips
            </h1>
            <div className="flex flex-wrap justify-center">
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/Uq-oQl5uJKI?si=L8y_mGT6PQil__XN"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  +50 SUSTAINABLE TIPS FOR BEGINNERS //teens & people living
                  with parents/roommates
                </h1>
              </div>
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/2RjsPZDG_RQ?si=7gYYXKnuj__f1m5H"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Sustainable Living Guide: 15 Green Living Tips for Home
                </h1>
              </div>
            </div>
          </div>
          <div id="industry" style={{ scrollMarginTop: "180px" }}>
            <h1 className="text-black font-bold text-xl md:text-3xl text-center bg-white/80 py-2 my-4">
              Industry and Technology
            </h1>
            <div className="flex flex-wrap justify-center">
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/_XTYv-AP4Jk?si=5ltvmEldIxhXRsDb"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Meet 8 Young Founders Turning Trash Into Cash | World Wide
                  Waste{" "}
                </h1>
              </div>
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/94Qqzbz7hZE?si=l-aO528avfKCHlQr"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Turning waste into electricity
                </h1>
              </div>
            </div>
          </div>
          <div id="documentries" style={{ scrollMarginTop: "180px" }}>
            <h1 className="text-black font-bold text-xl md:text-3xl text-center bg-white/80 py-2 my-4">
              Documentries and Short Films
            </h1>
            <div className="flex flex-wrap justify-center">
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/tZEM5K72aVs?si=EBk8zrs72ZFxIJ4N"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  Inside the solution to India's waste problem | Brut
                  Documentary
                </h1>
              </div>
              <div className="rounded m-2 flex flex-col items-center pt-2">
                <iframe
                  className="rounded md:w-[500px] h-60 md:h-[300px]"
                  src="https://www.youtube.com/embed/iO3SA4YyEYU?si=8DNLn2z7kR9KVrzq"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
                <h1 className="text-white p-2 text-center">
                  The story of plastic(Animated short)
                </h1>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
