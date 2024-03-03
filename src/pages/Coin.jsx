import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto';
export default function Coin() {
    const { name } = useParams();
    const [chartData, setChartData] = useState({
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
          {
            id: 1,
            label: 'Profit',
            data: [710000, 690000, 890000, 820000, 710000, 560000],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            tension: 0.1
          },
          {
            id: 2,
            label: 'Loss',
            data: [650000, 590000, 800000, 810000, 560000, 550000],
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)', // Border color
            borderWidth: 1, // Border width
            tension: 0.5
          }
        ]
    });
    
      const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: `${name} Price`,
            font: {
              size: 24,
              weight: 600,
              style: 'normal',
            },
            color: 'var(--color)',
            padding: 10
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return context.parsed.y + ' ' + context.dataset.label;
              },
            },
          },
          hover: {
            mode: 'index',
            intersect: false
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Month',
              font: {
                size: 14,
                weight: 600,
                style: 'normal',
                lineHeight: 1.2,
                family: 'Poppins, sans-serif',
              },
              color: '#000000',
              padding: 10
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Value',
              font: {
                size: 14,
                weight: 600,
                style: 'normal',
                lineHeight: 1.2,
                family: 'Poppins, sans-serif',
              },
              color: '#000000',
              padding: 10
            },
          },
        },
        elements: {
          point: {
            borderWidth: 0,
          },
        },
        animation: {
          duration: 0.5,
          easing: 'easeInQuad',
          loop: false,
          lazy: true,
          autoplay: true,
          animationData: null,
          animationOptions: null
        }
    };
    return (
        <>
            <div style={{ height: '600px', width: '900px', margin: '0 auto', overflowX: 'auto' }}>
                <Line data={chartData} options={options} />
            </div>
        </>
    )
}
