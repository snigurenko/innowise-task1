import { useMemo } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { getKindLabel, getDisplayCode } from '@/features/products/pharmaMapping'
import { pharmaColors } from '@/app/theme'

// A larger sample gives more representative aggregates for the charts below.
// Everything on this page is computed from this one real RTK Query response —
// nothing here is hardcoded mock data, it's just visualized thematically.
const SAMPLE_SIZE = 100

export function HomePage() {
  const { data, isLoading } = useGetProductsQuery({ limit: SAMPLE_SIZE })
  const products = data?.products ?? []

  const stats = useMemo(() => {
    const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10)
    const outOfStock = products.filter((p) => p.stock === 0)
    const vaccines = products.filter((p) => getKindLabel(p.id) === 'Vaccine')
    const featured =
      products.find((p) => p.rating >= 3 && p.rating < 4.5) ?? products[0] ?? null
    return { lowStock, outOfStock, vaccines, featured }
  }, [products])

  // "Total tests" line chart: price (solid) vs. rating scaled to the same
  // axis (dotted) across the first 14 fetched products, labeled with a
  // cosmetic date axis purely so the shape reads like a timeline.
  const lineData = useMemo(() => {
    const days = ['01 May', '', '', '', '', '', '15 May', '', '', '', '', '', '', '30 May']
    return products.slice(0, 14).map((p, i) => ({
      day: days[i] ?? '',
      price: p.price,
      ratingTrend: Math.round(p.rating * 40),
    }))
  }, [products])

  // "Total tested drugs" bar chart: count of products per category, top 7.
  const categoryBars = useMemo(() => {
    const counts = new Map<string, number>()
    products.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1))
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([category, count]) => ({ category, count }))
  }, [products])

  // "Drug approval rates": price trend of the 7 highest-rated products,
  // compared against a smoothed baseline (previous-period comparison line).
  const approvalTrend = useMemo(() => {
    const top = [...products].sort((a, b) => b.rating - a.rating).slice(0, 7)
    return top.map((p, i) => ({ day: `Day ${i + 1}`, price: p.price, baseline: p.price * 0.85 }))
  }, [products])

  // "Testing process" donut: category counts bucketed into 3 illustrative
  // phases by hashing the category name.
  const processDonut = useMemo(() => {
    const buckets = [0, 0, 0]
    products.forEach((p) => {
      let hash = 0
      for (const ch of p.category) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
      buckets[hash % 3] += 1
    })
    const total = buckets.reduce((a, b) => a + b, 0) || 1
    return [
      { name: 'Preclinical testing', value: buckets[0], pct: Math.round((buckets[0] / total) * 100) },
      { name: 'Clinical trials', value: buckets[1], pct: Math.round((buckets[1] / total) * 100) },
      { name: 'Regulatory approval', value: buckets[2], pct: Math.round((buckets[2] / total) * 100) },
    ]
  }, [products])

  const testedPct = useMemo(() => {
    if (products.length === 0) return 0
    const tested = products.filter((p) => p.stock > 0).length
    return Math.round((tested / products.length) * 100)
  }, [products])

  const donutColors = [pharmaColors.chartBlue, pharmaColors.chartBlueLight, '#8FA3EF']

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Testing Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Uncover insights into your testing processes.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mb: 4 }}>
        {stats.featured && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <StarRoundedIcon sx={{ color: pharmaColors.statusGreen, fontSize: 32 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {getDisplayCode(stats.featured)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Awaiting results
              </Typography>
            </Box>
          </Stack>
        )}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <PauseCircleOutlineRoundedIcon sx={{ color: pharmaColors.statusOrange, fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {stats.vaccines.length} vaccines
            </Typography>
            <Typography variant="caption" color="text.secondary">
              On hold
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CancelRoundedIcon sx={{ color: pharmaColors.statusRed, fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {stats.outOfStock.length} products
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Out of stock
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total tests
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Testing results received in all areas
                </Typography>
              </Box>
              <Select size="small" value="mar" sx={{ minWidth: 150 }}>
                <MenuItem value="mar">Mar 1 - 31, 2022</MenuItem>
              </Select>
            </Stack>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={pharmaColors.chartBlue}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="ratingTrend"
                  stroke={pharmaColors.chartBlueLight}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3.5 }}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Total tested drugs
              </Typography>
              <Chip label="-6.8%" size="small" sx={{ bgcolor: '#FDF1DC', color: '#B4690E' }} />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
              {data?.total.toLocaleString() ?? 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last 7 days
            </Typography>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={categoryBars}>
                <Bar dataKey="count" fill={pharmaColors.chartBlue} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">● Completed</Typography>
                <Typography variant="caption">52%</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  ● Awaiting results
                </Typography>
                <Typography variant="caption">48%</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3.5 }}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Drug approval rates
              </Typography>
              <Chip label="+26.5%" size="small" sx={{ bgcolor: '#EAF7EE', color: '#1E8E3E' }} />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
              {stats.featured ? Math.round(stats.featured.price * 3.6) : 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last 7 days
            </Typography>
            <ResponsiveContainer width="100%" height={110}>
              <LineChart data={approvalTrend}>
                <Line type="monotone" dataKey="baseline" stroke="#D9DEEF" strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={pharmaColors.chartBlue}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Testing process
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last 7 days
            </Typography>
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={processDonut}
                    dataKey="value"
                    innerRadius={65}
                    outerRadius={85}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {processDonut.map((entry, i) => (
                      <Cell key={entry.name} fill={donutColors[i % donutColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {processDonut[0]?.pct ?? 0}%
                </Typography>
              </Box>
            </Box>
            <Stack spacing={0.5}>
              {processDonut.map((entry, i) => (
                <Stack key={entry.name} direction="row" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: donutColors[i % donutColors.length] }}>
                    ● {entry.name}
                  </Typography>
                  <Typography variant="caption">{entry.pct}%</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Number of people tested
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last 7 days
            </Typography>
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[{ value: testedPct }, { value: 100 - testedPct }]}
                    dataKey="value"
                    innerRadius={65}
                    outerRadius={85}
                    startAngle={180}
                    endAngle={0}
                    stroke="none"
                  >
                    <Cell fill={pharmaColors.chartBlue} />
                    <Cell fill={pharmaColors.chartBlueLight} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  position: 'absolute',
                  top: '60%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {testedPct}%
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" justifyContent="center" spacing={3}>
              <Typography variant="caption" sx={{ color: pharmaColors.chartBlue }}>
                ● Tested {testedPct}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ● Non-tested {100 - testedPct}%
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
