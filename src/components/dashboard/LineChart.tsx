import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import * as chartjs from 'chart.js';
import { Line } from 'react-chartjs-2';
import Loading from '../Loading';

const categories = ['ATK', 'Kebersihan', 'Kendaraan', 'Komputer', 'Obat', 'Lain'];
const colors = ['#006666', '#4d4dff', '#ff3333', '#ffa500', '#008000', '#883dbd'];
const borderColors = ['#00666660', '#4d4dff60', '#ff333360', '#ffa50060', '#00800060', '#883dbd60'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const options: chartjs.ChartOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: 'bottom',
      align: 'center',
      labels: {
        padding: 30,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
  },
  elements: {
    line: {
      tension: 0.3,
    },
  },
};

const LineChart = ({ orders = [] }) => {
  const [ATKData, setATKData] = useState(Array(...Array(12)).map(Number.prototype.valueOf, 0));
  const [kendaraanData, setKendaraanData] = useState(Array(...Array(12)).map(Number.prototype.valueOf, 0));
  const [kebersihanData, setKebersihanData] = useState(Array(...Array(12)).map(Number.prototype.valueOf, 0));
  const [komputerData, setKomputerData] = useState(Array(...Array(12)).map(Number.prototype.valueOf, 0));
  const [obatData, setObatData] = useState(Array(...Array(12)).map(Number.prototype.valueOf, 0));
  const [lainData, setLainData] = useState(Array(...Array(12)).map(Number.prototype.valueOf, 0));
  const [loading, setLoading] = useState(true);

  const mainData = {
    labels: months,
    datasets: [
      {
        fill: false,
        label: categories[0],
        data: ATKData,
        backgroundColor: colors[0],
        borderColor: borderColors[0],
        borderWidth: 2,
      },
      {
        fill: false,
        label: categories[1],
        data: kebersihanData,
        backgroundColor: colors[1],
        borderColor: borderColors[1],
        borderWidth: 2,
      },
      {
        fill: false,
        label: categories[2],
        data: kendaraanData,
        backgroundColor: colors[2],
        borderColor: borderColors[2],
        borderWidth: 2,
      },
      {
        fill: false,
        label: categories[3],
        data: komputerData,
        backgroundColor: colors[3],
        borderColor: borderColors[3],
        borderWidth: 2,
      },
      {
        fill: false,
        label: categories[4],
        data: obatData,
        backgroundColor: colors[4],
        borderColor: borderColors[4],
        borderWidth: 2,
      },
      {
        fill: false,
        label: categories[5],
        data: lainData,
        backgroundColor: colors[5],
        borderColor: borderColors[5],
        borderWidth: 2,
      },
    ],
  };

  const atk = Array(...Array(12)).map(Number.prototype.valueOf, 0);
  const kendaraan = Array(...Array(12)).map(Number.prototype.valueOf, 0);
  const kebersihan = Array(...Array(12)).map(Number.prototype.valueOf, 0);
  const komputer = Array(...Array(12)).map(Number.prototype.valueOf, 0);
  const obat = Array(...Array(12)).map(Number.prototype.valueOf, 0);
  const lain = Array(...Array(12)).map(Number.prototype.valueOf, 0);
  const setStateData = useCallback(
    (indexOfMonth, category, quantity) => {
      switch (category) {
        case 'alat tulis kantor':
          atk[indexOfMonth] = quantity;
          setATKData(atk);
          break;
        case 'alat kebersihan':
          kebersihan[indexOfMonth] = quantity;
          setKebersihanData(kebersihan);
          break;
        case 'alat kendaraan':
          kendaraan[indexOfMonth] = quantity;
          setKendaraanData(kendaraan);
          break;
        case 'alat komputer':
          komputer[indexOfMonth] = quantity;
          setKomputerData(komputer);
          break;
        case 'obat obatan':
          obat[indexOfMonth] = quantity;
          setObatData(obat);
          break;
        default:
          lain[indexOfMonth] = quantity;
          setLainData(lain);
          break;
      }
    },
    [atk, kebersihan, kendaraan, komputer, lain, obat]
  );

  const setChart = useCallback(() => {
    orders.forEach((order) => {
      order.carts.forEach((cart) => {
        const { quantity, createdAt, productCategory } = cart;
        const date = new Date(createdAt);
        const getMonth = months[date.getMonth()];
        // eslint-disable-next-line eqeqeq
        const indexOfMonth = months.findIndex((month) => month == getMonth);
        setStateData(indexOfMonth, productCategory, quantity);
      });
    });
  }, [setStateData, orders]);

  useEffect(() => {
    if (!orders) {
      setLoading(true);
    } else {
      setChart();
      setLoading(false);
    }
  }, [orders, setChart]);

  return (
    <Box sx={{ padding: '2rem 1rem', height: { xs: 'auto', md: '32.5rem' } }}>
      {loading ? <Loading /> : <Line data={mainData} options={options} height={200} />}
    </Box>
  );
};

export default LineChart;
