export const htmlTemplateStringCharts: string = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>System Monitoring</title>

    <script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
      body {
        font-family: sans-serif;
        background: #f4f6f8;
        margin: 0;
        padding: 1rem;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .tab-list {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        list-style-type: none;
        padding-left: 0;
      }

      .tab-list button {
        padding: 0.5rem 1rem;
        border: none;
        background: #eee;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .tab-list button.active {
        background-color: #3498db;
        color: white;
      }

      .tab-list button:hover:not(.active) {
        background-color: #ddd;
      }

      .chart-container {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        margin: 1rem auto;
      }

      .chart-narrow {
        width: 50%;
        max-width: 50%;
        margin: 0 auto;
      }

      .chart-narrow canvas {
        max-height: 300px;
      }

      .process-card strong {
        font-size: 1.1em;
      }

      .process-card p {
        margin: 5px 0;
      }

      .process-card {
        position: relative;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
        padding: 20px;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        cursor: pointer;
      }

      .process-card:hover {
        transform: scale(1.03);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
        z-index: 9999;
      }

      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 2s linear infinite;
      }

      .timestamp {
        text-align: center;
        color: #666;
        font-size: 0.9em;
        margin-top: -10px;
        margin-bottom: 10px;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      h2 {
        text-align: center;
        margin-bottom: 1rem;
        color: #333;
      }
    </style>
  </head>
  <body>
    <div x-data="monitoringApp()" x-init="initApp()" class="container">
      <nav>
        <ul class="tab-list" role="tablist">
          <li>
            <button @click="switchTab('cpu')" :class="{active: activeTab === 'cpu'}">
              CPU
            </button>
          </li>
          <li>
            <button
              @click="switchTab('memory')"
              :class="{active: activeTab === 'memory'}"
            >
              Memory
            </button>
          </li>
          <li>
            <button
              @click="switchTab('disk')"
              :class="{active: activeTab === 'disk'}"
            >
              Disk
            </button>
          </li>
          <li>
            <button
              @click="switchTab('process')"
              :class="{active: activeTab === 'process'}"
            >
              Node.js Process
            </button>
          </li>
        </ul>
      </nav>

      <div x-show="loading" class="loading-spinner">
        <p>Loading...</p>
        <div class="spinner"></div>
      </div>

      <div x-show="activeTab === 'cpu' && !loading" x-transition>
        <div class="chart-container">
          <h2>CPU Load Over Time</h2>
          <template x-if="showNoDataMessage">
            <div x-html="document.getElementById('no-data-message').innerHTML"></div>
          </template>
          <canvas id="cpuLineChart" x-show="!showNoDataMessage"></canvas>
        </div>

        <div class="chart-container">
          <div class="chart-narrow">
            <h2>Current CPU Usage</h2>
            <p class="timestamp">
              <span x-text="formatTooltipDate(data.timestamp)"></span>
            </p>
            <canvas id="cpuPieChart"></canvas>
          </div>
        </div>
      </div>

      <div x-show="activeTab === 'memory' && !loading" x-transition>
        <div class="chart-container">
          <h2>Memory Usage Over Time</h2>
          <template x-if="showNoDataMessage">
            <div x-html="document.getElementById('no-data-message').innerHTML"></div>
          </template>
          <canvas id="memoryLineChart" x-show="!showNoDataMessage"></canvas>
        </div>

        <div class="chart-container">
          <div class="chart-narrow">
            <h2>Current Memory Usage</h2>
            <p class="timestamp">
              <span x-text="formatTooltipDate(data.timestamp)"></span>
            </p>
            <canvas id="memoryBarChart"></canvas>
          </div>
        </div>
      </div>

      <div x-show="activeTab === 'disk' && !loading" x-transition>
        <div class="chart-container">
          <h2>Disks Usage Over Time</h2>
          <template x-if="showNoDataMessage">
            <div x-html="document.getElementById('no-data-message').innerHTML"></div>
          </template>
          <canvas id="diskLineChart" x-show="!showNoDataMessage"></canvas>
        </div>

        <div class="chart-container">
          <div class="chart-narrow">
            <h2>Current Disk Usage</h2>
            <p class="timestamp">
              <span x-text="formatTooltipDate(data.timestamp)"></span>
            </p>
            <canvas id="diskBarChart"></canvas>
          </div>
        </div>
      </div>

      <div x-show="activeTab === 'process' && !loading" x-transition>
        <div class="chart-container">
          <h2>Node.js CPU Usage Over Time</h2>
          <template x-if="showNoDataMessage">
            <div x-html="document.getElementById('no-data-message').innerHTML"></div>
          </template>
          <canvas id="processCpuLineChart" x-show="!showNoDataMessage"></canvas>
        </div>
        <div class="chart-container">
          <h2>Node.js Memory Usage Over Time</h2>
          <template x-if="showNoDataMessage">
            <div x-html="document.getElementById('no-data-message').innerHTML"></div>
          </template>
          <canvas id="processMemLineChart" x-show="!showNoDataMessage"></canvas>
        </div>

        <div x-show="data.processLoad.length > 0">
          <template x-for="process in data.processLoad" :key="process.pid">
            <div class="chart-container">
              <h2>Current Node.js Process</h2>
              <p class="timestamp">
                <span x-text="formatTooltipDate(data.timestamp)"></span>
              </p>
              <div class="process-card">
                <p>
                  <strong>Process: </strong>
                  <span x-text="process.proc"></span>
                </p>
                <p><strong>PID:</strong> <span x-text="process.pid"></span></p>
                <p>
                  <strong>CPU Usage:</strong>
                  <span x-text="process.cpu.toFixed(2)"></span>%
                </p>
                <p>
                  <strong>Memory Usage:</strong>
                  <span x-text="process.mem.toFixed(2)"></span>%
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <template id="no-data-message">
      <div style="text-align: center">
        <p style="text-decoration: underline dotted red; font-style: italic">
          No available historical data to show
        </p>
      </div>
    </template>

    <script>
      const currentDataUrl = '/v1/system-monitoring/all';
      const historicalDataUrl = '/v1/system-monitoring/historical';
      const currentTab = localStorage.getItem('selectedTab') ?? 'cpu';

      function monitoringApp() {
        return {
          activeTab: currentTab,
          loading: true,
          showNoDataMessage: false,
          data: {
            timestamp: null,
            cpu: {},
            memory: {},
            disk: [],
            processLoad: [],
          },
          historicalData: [],
          charts: {},
          initializedTabs: new Set(),

          formatTooltipDate(timestamp) {
            return new Date(timestamp).toLocaleString();
          },

          async initApp() {
            await this.fetchData();
            await this.fetchHistoricalData();
            this.loading = false;

            this.switchTab((this.activeTab = currentTab));
          },

          async switchTab(tabName) {
            this.activeTab = tabName;

            localStorage.setItem('selectedTab', tabName);

            if (!this.initializedTabs.has(tabName)) {
              this.loading = true;
              try {
                switch (tabName) {
                  case 'cpu':
                    await this.initCpuCharts();
                    break;
                  case 'memory':
                    await this.initMemoryCharts();
                    break;
                  case 'disk':
                    await this.initDiskCharts();
                    break;
                  case 'process':
                    await this.initProcessCharts();
                    break;
                }
                this.initializedTabs.add(tabName);
              } catch (error) {
                console.error(\`Error initializing \${tabName} tab:\`, error);
              } finally {
                this.loading = false;
              }
            }
          },

          async fetchData() {
            try {
              const response = await fetch(currentDataUrl);
              this.data = await response.json();
            } catch (error) {
              console.error('Failed to fetch current data:', error);
            }
          },

          async fetchHistoricalData() {
            try {
              const res = await fetch(historicalDataUrl);
              this.historicalData = await res.json();
              this.showNoDataMessage = this.historicalData.length === 0;
            } catch (err) {
              console.error('Failed to fetch metrics:', err);
              this.showNoDataMessage = true;
            }
          },

          async initCpuCharts() {
            this.renderCPUPieChart();
            if (this.historicalData.length > 0) {
              this.renderCPULineChart();
            }
          },

          async initMemoryCharts() {
            this.renderMemoryBarChart();
            if (this.historicalData.length > 0) {
              this.renderMemoryLineChart();
            }
          },

          async initDiskCharts() {
            this.renderDiskBarChart();
            if (this.historicalData.length > 0) {
              this.renderDiskLineChart();
            }
          },

          async initProcessCharts() {
            if (this.historicalData.length > 0) {
              this.renderProcessCpuChart();
              this.renderProcessMemChart();
            }
          },

          renderCPULineChart() {
            if (this.charts.cpuLine) this.charts.cpuLine.destroy();

            const cpuCtx = document.getElementById('cpuLineChart')?.getContext('2d');
            if (cpuCtx && this.historicalData.length > 0) {
              const labels = this.historicalData.map((m) =>
                new Date(m.timestamp).toLocaleTimeString(),
              );
              const cpuLoad = this.historicalData.map((m) => m.cpu.currentLoad);

              this.charts.cpuLine = new Chart(cpuCtx, {
                type: 'line',
                data: {
                  labels,
                  datasets: [
                    {
                      label: 'CPU Load (%)',
                      data: cpuLoad,
                      borderColor: 'rgba(54, 162, 235, 1)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      fill: true,
                      tension: 0.3,
                    },
                  ],
                },
                options: {
                  responsive: true,
                  animation: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: { display: true, text: 'CPU Load (%)' },
                    },
                    x: {
                      title: { display: true, text: 'Time' },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (context) => {
                          const index = context[0].dataIndex;
                          const timestamp = this.historicalData[index].timestamp;
                          return this.formatTooltipDate(timestamp);
                        },
                      },
                    },
                  },
                },
              });
            }
          },

          renderCPUPieChart() {
            if (this.charts.cpuPie) this.charts.cpuPie.destroy();

            const cpuPieCtx = document
              .getElementById('cpuPieChart')
              ?.getContext('2d');
            if (cpuPieCtx && this.data.cpu) {
              this.charts.cpuPie = new Chart(cpuPieCtx, {
                type: 'pie',
                data: {
                  labels: ['User', 'System', 'Idle'],
                  datasets: [
                    {
                      label: 'CPU Load',
                      data: [
                        this.data.cpu.currentLoadUser,
                        this.data.cpu.currentLoadSystem,
                        this.data.cpu.currentLoadIdle,
                      ],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                      ],
                    },
                  ],
                },
                options: {
                  responsive: true,
                  animation: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => tooltipItem.raw.toFixed(2) + '%',
                      },
                    },
                  },
                },
              });
            }
          },

          renderMemoryLineChart() {
            if (this.charts.memoryLine) this.charts.memoryLine.destroy();

            const memLineCtx = document
              .getElementById('memoryLineChart')
              ?.getContext('2d');
            if (memLineCtx) {
              const labels = this.historicalData.map((m) =>
                new Date(m.timestamp).toLocaleTimeString(),
              );
              const memUsage = this.historicalData.map(
                (m) => (m.memory.used / m.memory.total) * 100,
              );

              this.charts.memoryLine = new Chart(memLineCtx, {
                type: 'line',
                data: {
                  labels,
                  datasets: [
                    {
                      label: 'Memory Usage (%)',
                      data: memUsage,
                      borderColor: 'rgba(255, 99, 132, 1)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      fill: true,
                      tension: 0.3,
                    },
                  ],
                },
                options: {
                  responsive: true,
                  animation: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: { display: true, text: 'Memory Usage (%)' },
                    },
                    x: {
                      title: { display: true, text: 'Time' },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (context) => {
                          const index = context[0].dataIndex;
                          const timestamp = this.historicalData[index].timestamp;
                          return this.formatTooltipDate(timestamp);
                        },
                      },
                    },
                  },
                },
              });
            }
          },
          renderMemoryBarChart() {
            if (this.charts.memoryBar) this.charts.memoryBar.destroy();

            const memBarCtx = document
              .getElementById('memoryBarChart')
              ?.getContext('2d');
            if (memBarCtx && this.data.memory) {
              this.charts.memoryBar = new Chart(memBarCtx, {
                type: 'bar',
                data: {
                  labels: ['Used', 'Available'],
                  datasets: [
                    {
                      label: 'Memory Usage (GB)',
                      data: [
                        this.data.memory.used / 1073741824,
                        this.data.memory.available / 1073741824,
                      ],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                      ],
                    },
                  ],
                },
                options: {
                  responsive: true,
                  animation: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'GB' },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => tooltipItem.raw.toFixed(2) + ' GB',
                      },
                    },
                  },
                },
              });
            }
          },

          renderDiskLineChart() {
            if (this.charts.diskLine) this.charts.diskLine.destroy();

            const diskLineCtx = document
              .getElementById('diskLineChart')
              ?.getContext('2d');
            if (diskLineCtx && this.historicalData.length > 0) {
              const labels = this.historicalData.map((m) =>
                new Date(m.timestamp).toLocaleTimeString(),
              );

              const diskNames = Array.from(
                new Set(
                  this.historicalData.flatMap((m) => m.disk?.map((d) => d.fs) || []),
                ),
              );

              const datasets = diskNames.map((fs, index) => {
                const colors = [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                ];

                return {
                  label: \`Disk \${fs} Usage (%)\`,
                  data: this.historicalData.map((m) => {
                    const disk = m.disk?.find((d) => d.fs === fs);
                    return disk ? disk.use : null;
                  }),
                  borderColor: colors[index % colors.length],
                  backgroundColor: colors[index % colors.length].replace(
                    '1)',
                    '0.2)',
                  ),
                  fill: true,
                  tension: 0.3,
                };
              });

              this.charts.diskLine = new Chart(diskLineCtx, {
                type: 'line',
                data: {
                  labels,
                  datasets,
                },
                options: {
                  responsive: true,
                  animation: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: { display: true, text: 'Disk Usage (%)' },
                    },
                    x: {
                      title: { display: true, text: 'Time' },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (context) => {
                          const index = context[0].dataIndex;
                          const timestamp = this.historicalData[index].timestamp;
                          return this.formatTooltipDate(timestamp);
                        },
                      },
                    },
                  },
                },
              });
            }
          },

          renderDiskBarChart() {
            if (this.charts.diskBar) this.charts.diskBar.destroy();

            const diskBarCtx = document
              .getElementById('diskBarChart')
              ?.getContext('2d');
            if (diskBarCtx && this.data.disk) {
              this.charts.diskBar = new Chart(diskBarCtx, {
                type: 'bar',
                data: {
                  labels: this.data.disk.map((disk) => disk.fs),
                  datasets: [
                    {
                      label: 'Disk Usage (%)',
                      data: this.data.disk.map((disk) => disk.use),
                      backgroundColor: this.data.disk.map((disk) =>
                        disk.use > 80
                          ? 'rgba(255, 99, 132, 0.6)'
                          : 'rgba(75, 192, 192, 0.6)',
                      ),
                    },
                  ],
                },
                options: {
                  responsive: true,
                  animation: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: { display: true, text: 'Usage (%)' },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {},
                    },
                  },
                },
              });
            }
          },

          renderProcessCpuChart() {
            if (this.charts.processCpuOverTime)
              this.charts.processCpuOverTime.destroy();

            const labels = this.historicalData.map((m) =>
              new Date(m.timestamp).toLocaleTimeString(),
            );

            const cpuData = this.historicalData.map((m) => {
              const proc = m.processLoad?.find((p) => p.proc === 'node');
              return proc ? proc.cpu : 0;
            });

            const cpuCtx = document
              .getElementById('processCpuLineChart')
              ?.getContext('2d');

            if (cpuCtx) {
              this.charts.processCpuOverTime = new Chart(cpuCtx, {
                type: 'line',
                data: {
                  labels,
                  datasets: [
                    {
                      label: 'Node CPU Usage (%)',
                      data: cpuData,
                      borderColor: 'rgba(255, 159, 64, 1)',
                      backgroundColor: 'rgba(255, 159, 64, 0.2)',
                      fill: true,
                      tension: 0.3,
                    },
                  ],
                },
                options: {
                  responsive: true,
                  animation: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: { display: true, text: 'CPU (%)' },
                    },
                    x: { title: { display: true, text: 'Time' } },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (context) => {
                          const index = context[0].dataIndex;
                          const timestamp = this.historicalData[index].timestamp;
                          return this.formatTooltipDate(timestamp);
                        },
                      },
                    },
                  },
                },
              });
            }
          },

          renderProcessMemChart() {
            if (this.charts.processMemOverTime)
              this.charts.processMemOverTime.destroy();

            const labels = this.historicalData.map((m) =>
              new Date(m.timestamp).toLocaleTimeString(),
            );

            const memData = this.historicalData.map((m) => {
              const proc = m.processLoad?.find((p) => p.proc === 'node');
              return proc ? proc.mem : 0;
            });

            const memCtx = document
              .getElementById('processMemLineChart')
              ?.getContext('2d');

            if (memCtx) {
              this.charts.processMemOverTime = new Chart(memCtx, {
                type: 'line',
                data: {
                  labels,
                  datasets: [
                    {
                      label: 'Node Memory Usage (%)',
                      data: memData,
                      borderColor: 'rgba(153, 102, 255, 1)',
                      backgroundColor: 'rgba(153, 102, 255, 0.2)',
                      fill: true,
                      tension: 0.3,
                    },
                  ],
                },
                options: {
                  responsive: true,
                  animation: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: { display: true, text: 'Memory (%)' },
                    },
                    x: { title: { display: true, text: 'Time' } },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (context) => {
                          const index = context[0].dataIndex;
                          const timestamp = this.historicalData[index].timestamp;
                          return this.formatTooltipDate(timestamp);
                        },
                      },
                    },
                  },
                },
              });
            }
          },
        };
      }
    </script>
  </body>
</html>
`;
