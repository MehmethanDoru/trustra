"use client";

import Image from "next/image";
import WeatherSelect from "@/components/WeatherSelect";
import DateRangePicker from "@/components/DateRangePicker";
import { useState, useEffect } from "react";


interface HeroProps {
  onWeatherSelect: (weather: { id: number; name: string } | null) => void;
  onDateSelect: (dates: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const texts = ["Hava Koşuluna Göre", "Hava Sıcaklığına Göre"];

export default function Hero({ onWeatherSelect, onDateSelect, onSearch, isLoading }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"route" | "all">("all");
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  const handleTabChange = (tab: "route" | "all") => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const currentText = texts[loopNum % texts.length];
    const shouldDelete = isDeleting;
    
    const timeout = setTimeout(() => {
      if (!shouldDelete && text.length < currentText.length) {
        setText(currentText.slice(0, text.length + 1));
      } else if (shouldDelete && text.length > 0) {
        setText(currentText.slice(0, text.length - 1));
      } else if (text.length === 0) {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      } else if (!shouldDelete && text.length === currentText.length) {
        setIsDeleting(true);
      }
    }, isDeleting ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, loopNum]);

  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero.webp"
          alt="Seyahat arka plan"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mt-0">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="space-y-6 mb-12">
            {/* Tab Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 inline-flex">
                <button
                  onClick={() => handleTabChange("all")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    activeTab === "all"
                      ? "bg-white text-blue-600 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Tüm Tarihler
                </button>
                <button
                  onClick={() => handleTabChange("route")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    activeTab === "route"
                      ? "bg-white text-blue-600 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Rota Oluştur
                </button>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#fff] [text-shadow:_0_1px_12px_rgb(0_0_0_/_20%)] tracking-tight leading-tight sm:leading-normal ">
              <span className="inline-block   border-b-[3px] border-[#fff] pr-1">
                {text}
              </span>
              <br className="sm:hidden" />
              <span className="text-[#ffffff] "> Seyahat Planla</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 font-medium max-w-2xl mx-auto [text-shadow:_0_1px_8px_rgb(0_0_0_/_20%)]">
              İdeal tatil noktanızı keşfedin
            </p>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <WeatherSelect onSelect={onWeatherSelect} />
            <DateRangePicker onSelect={onDateSelect} />
          </div>

          <button
            onClick={onSearch}
            disabled={isLoading}
            className="mx-auto px-8 py-4 bg-[#4cbafa] text-white text-lg font-medium rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 disabled:from-blue-400 disabled:to-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[180px]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="animate-pulse">Aranıyor...</span>
              </>
            ) : (
              <span className="flex items-center gap-2">
                {activeTab === "all" ? "Şehirleri Bul" : "Rota Oluştur"}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
