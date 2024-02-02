"use client";
import loginContext from "@/app/loginContext";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { profileContext } from "../profileContext";
import UserStats from "../../../../../interfaces/UserStats.model";
import IChart from "../../../../../interfaces/Chart.model";
function GenreStats() {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const { user } = useContext(loginContext);
  const {
    userStats,
    setUserStats,
    chartData,
    setChartData,
    watchlist,
    playlists,
  } = useContext(profileContext);
  useEffect(() => {
    const getStats = async () => {
      try {
        const url = `http://localhost:3000/api/users/${user?.userId}/stats`;
        const response = await axios.get(url);
        const { playlists, reviews, watchlist, genresStats } =
          response.data.data;
        const newGenresStats = Object.entries(genresStats).map((genre) => {
          const key: string = genre[0];
          const value: number = genre[1];
          return { genre: key, count: value };
        });

        const data: IChart = {
          labels: newGenresStats.map((genre) => genre.genre),
          datasets: [
            {
              label: "Your genres",
              data: newGenresStats.map((genre) => genre.count),
              backgroundColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",

                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };

        setChartData(data);

        return {
          playlists,
          reviews,
          watchlist,
          genresStats: newGenresStats,
        };
      } catch (e) {
        return {};
      }
    };
    getStats()
      .then((data) => {
        setUserStats(data);
      })
      .catch(() => {
        setUserStats({} as UserStats);
      });
  }, []);

  return (
    <>
      {userStats ? (
        <div className="watchNum text-center">
          <div className="collapse bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium text-center">
              Your stats:
            </div>
            <div className="collapse-content">
              <p> Number of playlists:{userStats.playlists}</p>
              <p>Number of reviews:{userStats.reviews}</p>
              <p> Number of movies in watchlist:{userStats.watchlist}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="py-5">
        {chartData && chartData.datasets && chartData.labels ? (
          <Pie data={chartData} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default GenreStats;
