import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const Lottie = dynamic(() => import('lottie-react'), { 
  ssr: false,
  loading: () => (
    <div className="w-64 h-64 flex items-center justify-center">
      {/* Placeholder animation while Lottie loads */}
      <div className="flex justify-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-8 bg-primary rounded-full"
            animate={{
              scaleY: [1, 1.8, 1, 0.7, 1.4, 1],
              opacity: [0.6, 1, 0.6, 0.4, 0.9, 0.6],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  )
});

// Enhanced trading animation data
const autoTradeAnimationData = {
  v: "5.8.1",
  fr: 60,
  ip: 0,
  op: 180,
  w: 400,
  h: 400,
  nm: "Auto Trade Animation",
  ddd: 0,
  assets: [],
  layers: [
    // Background circle with pulse effect
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Pulse Circle",
      sr: 1,
      ks: {
        o: { 
          a: 1, 
          k: [
            { t: 0, s: [20], h: 0 },
            { t: 90, s: [40], h: 0 },
            { t: 180, s: [20], h: 0 }
          ],
          ix: 11 
        },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [200, 200, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { 
          a: 1, 
          k: [
            { t: 0, s: [100, 100, 100], h: 0 },
            { t: 90, s: [120, 120, 100], h: 0 },
            { t: 180, s: [100, 100, 100], h: 0 }
          ], 
          ix: 6
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [180, 180], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path 1",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0, 0.9, 0.9, 1], ix: 3 },
              o: { a: 0, k: 20, ix: 4 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Pulse Circle",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          hd: false
        }
      ],
      ip: 0,
      op: 180,
      st: 0,
      bm: 0
    },
    // Main circle with border
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Main Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [200, 200, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [140, 140], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path 1",
              hd: false
            },
            {
              ty: "st",
              c: { a: 0, k: [0, 0.9, 0.9, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 6, ix: 5 },
              lc: 2,
              lj: 2,
              bm: 0,
              nm: "Stroke 1",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { 
                a: 1, 
                k: [
                  { t: 0, s: [0], h: 0 },
                  { t: 180, s: [360], h: 0 }
                ], 
                ix: 6 
              },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Rotating Border",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          hd: false
        }
      ],
      ip: 0,
      op: 180,
      st: 0,
      bm: 0
    },
    // Candlestick charts
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Candlesticks",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [200, 200, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        // Green candle 1
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [10, 20], ix: 2 },
              p: { a: 0, k: [-40, -10], ix: 3 },
              r: { a: 0, k: 2, ix: 4 },
              nm: "Rectangle Path 1",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0, 0.8, 0.4, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { 
                a: 1, 
                k: [
                  { t: 0, s: [100, 100], h: 0 },
                  { t: 60, s: [100, 130], h: 0 },
                  { t: 120, s: [100, 100], h: 0 },
                  { t: 180, s: [100, 120], h: 0 }
                ], 
                ix: 3 
              },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Green Candle 1",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          hd: false
        },
        // Red candle
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [10, 25], ix: 2 },
              p: { a: 0, k: [-20, 0], ix: 3 },
              r: { a: 0, k: 2, ix: 4 },
              nm: "Rectangle Path 1",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.9, 0.2, 0.2, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { 
                a: 1, 
                k: [
                  { t: 0, s: [100, 100], h: 0 },
                  { t: 45, s: [100, 80], h: 0 },
                  { t: 90, s: [100, 100], h: 0 },
                  { t: 135, s: [100, 90], h: 0 },
                  { t: 180, s: [100, 80], h: 0 }
                ], 
                ix: 3 
              },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Red Candle",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 2,
          hd: false
        },
        // Green candle 2
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [10, 30], ix: 2 },
              p: { a: 0, k: [0, -5], ix: 3 },
              r: { a: 0, k: 2, ix: 4 },
              nm: "Rectangle Path 1",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0, 0.8, 0.4, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { 
                a: 1, 
                k: [
                  { t: 0, s: [100, 100], h: 0 },
                  { t: 60, s: [100, 150], h: 0 },
                  { t: 120, s: [100, 120], h: 0 },
                  { t: 180, s: [100, 140], h: 0 }
                ], 
                ix: 3 
              },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Green Candle 2",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 3,
          hd: false
        },
        // Green candle 3
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [10, 15], ix: 2 },
              p: { a: 0, k: [20, 0], ix: 3 },
              r: { a: 0, k: 2, ix: 4 },
              nm: "Rectangle Path 1",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0, 0.8, 0.4, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { 
                a: 1, 
                k: [
                  { t: 0, s: [100, 100], h: 0 },
                  { t: 50, s: [100, 120], h: 0 },
                  { t: 100, s: [100, 130], h: 0 },
                  { t: 150, s: [100, 150], h: 0 },
                  { t: 180, s: [100, 160], h: 0 }
                ], 
                ix: 3 
              },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Green Candle 3",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 4,
          hd: false
        },
        // Red candle 2
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [10, 20], ix: 2 },
              p: { a: 0, k: [40, 5], ix: 3 },
              r: { a: 0, k: 2, ix: 4 },
              nm: "Rectangle Path 1",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.9, 0.2, 0.2, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { 
                a: 1, 
                k: [
                  { t: 0, s: [100, 100], h: 0 },
                  { t: 45, s: [100, 85], h: 0 },
                  { t: 90, s: [100, 70], h: 0 },
                  { t: 135, s: [100, 80], h: 0 },
                  { t: 180, s: [100, 75], h: 0 }
                ], 
                ix: 3 
              },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Red Candle 2",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 5,
          hd: false
        }
      ],
      ip: 0,
      op: 180,
      st: 0,
      bm: 0
    },
    // AI Brain or Nodes layer
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "AI Nodes",
      sr: 1,
      ks: {
        o: { 
          a: 1, 
          k: [
            { t: 0, s: [70], h: 0 },
            { t: 90, s: [100], h: 0 },
            { t: 180, s: [70], h: 0 }
          ], 
          ix: 11 
        },
        r: { 
          a: 1, 
          k: [
            { t: 0, s: [0], h: 0 },
            { t: 180, s: [720], h: 0 }
          ], 
          ix: 10 
        },
        p: { a: 0, k: [200, 200, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [80, 80, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        // Node points & connections
        {
          ty: "gr",
          it: [
            // Circle nodes
            {
              ty: "gr",
              it: [
                {
                  d: 1,
                  ty: "el",
                  s: { a: 0, k: [10, 10], ix: 2 },
                  p: { a: 0, k: [40, 0], ix: 3 },
                  nm: "Node 1",
                  hd: false
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [1, 1, 1, 1], ix: 3 },
                  o: { a: 0, k: 100, ix: 4 },
                  r: 1,
                  bm: 0,
                  nm: "Fill 1",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transform"
                }
              ],
              nm: "Node 1",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 1,
              hd: false
            },
            {
              ty: "gr",
              it: [
                {
                  d: 1,
                  ty: "el",
                  s: { a: 0, k: [10, 10], ix: 2 },
                  p: { a: 0, k: [-40, 0], ix: 3 },
                  nm: "Node 2",
                  hd: false
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [1, 1, 1, 1], ix: 3 },
                  o: { a: 0, k: 100, ix: 4 },
                  r: 1,
                  bm: 0,
                  nm: "Fill 2",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transform"
                }
              ],
              nm: "Node 2",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 2,
              hd: false
            },
            {
              ty: "gr",
              it: [
                {
                  d: 1,
                  ty: "el",
                  s: { a: 0, k: [10, 10], ix: 2 },
                  p: { a: 0, k: [0, -40], ix: 3 },
                  nm: "Node 3",
                  hd: false
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [1, 1, 1, 1], ix: 3 },
                  o: { a: 0, k: 100, ix: 4 },
                  r: 1,
                  bm: 0,
                  nm: "Fill 3",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transform"
                }
              ],
              nm: "Node 3",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 3,
              hd: false
            },
            {
              ty: "gr",
              it: [
                {
                  d: 1,
                  ty: "el",
                  s: { a: 0, k: [10, 10], ix: 2 },
                  p: { a: 0, k: [0, 40], ix: 3 },
                  nm: "Node 4",
                  hd: false
                },
                {
                  ty: "fl",
                  c: { a: 0, k: [1, 1, 1, 1], ix: 3 },
                  o: { a: 0, k: 100, ix: 4 },
                  r: 1,
                  bm: 0,
                  nm: "Fill 4",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transform"
                }
              ],
              nm: "Node 4",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 4,
              hd: false
            },
            // Connection lines
            {
              ty: "gr",
              it: [
                {
                  ty: "sh",
                  d: 1,
                  ks: {
                    a: 0,
                    k: {
                      c: false,
                      v: [
                        [40, 0],
                        [0, -40]
                      ],
                      i: [
                        [0, 0],
                        [0, 0]
                      ],
                      o: [
                        [0, 0],
                        [0, 0]
                      ]
                    },
                    ix: 2
                  },
                  nm: "Line 1",
                  hd: false
                },
                {
                  ty: "st",
                  c: { a: 0, k: [0, 0.9, 0.9, 1], ix: 3 },
                  o: { a: 0, k: 80, ix: 4 },
                  w: { a: 0, k: 2, ix: 5 },
                  lc: 2,
                  lj: 2,
                  bm: 0,
                  nm: "Stroke 1",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transform"
                }
              ],
              nm: "Connection 1",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 5,
              hd: false
            },
            {
              ty: "gr",
              it: [
                {
                  ty: "sh",
                  d: 1,
                  ks: {
                    a: 0,
                    k: {
                      c: false,
                      v: [
                        [-40, 0],
                        [0, -40]
                      ],
                      i: [
                        [0, 0],
                        [0, 0]
                      ],
                      o: [
                        [0, 0],
                        [0, 0]
                      ]
                    },
                    ix: 2
                  },
                  nm: "Line 2",
                  hd: false
                },
                {
                  ty: "st",
                  c: { a: 0, k: [0, 0.9, 0.9, 1], ix: 3 },
                  o: { a: 0, k: 80, ix: 4 },
                  w: { a: 0, k: 2, ix: 5 },
                  lc: 2,
                  lj: 2,
                  bm: 0,
                  nm: "Stroke 2",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transform"
                }
              ],
              nm: "Connection 2",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 6,
              hd: false
            },
            {
              ty: "gr",
              it: [
                {
                  ty: "sh",
                  d: 1,
                  ks: {
                    a: 0,
                    k: {
                      c: false,
                      v: [
                        [40, 0],
                        [0, 40]
                      ],
                      i: [
                        [0, 0],
                        [0, 0]
                      ],
                      o: [
                        [0, 0],
                        [0, 0]
                      ]
                    },
                    ix: 2
                  },
                  nm: "Line 3",
                  hd: false
                },
                {
                  ty: "st",
                  c: { a: 0, k: [0, 0.9, 0.9, 1], ix: 3 },
                  o: { a: 0, k: 80, ix: 4 },
                  w: { a: 0, k: 2, ix: 5 },
                  lc: 2,
                  lj: 2,
                  bm: 0,
                  nm: "Stroke 3",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transform"
                }
              ],
              nm: "Connection 3",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 7,
              hd: false
            },
            {
              ty: "gr",
              it: [
                {
                  ty: "sh",
                  d: 1,
                  ks: {
                    a: 0,
                    k: {
                      c: false,
                      v: [
                        [-40, 0],
                        [0, 40]
                      ],
                      i: [
                        [0, 0],
                        [0, 0]
                      ],
                      o: [
                        [0, 0],
                        [0, 0]
                      ]
                    },
                    ix: 2
                  },
                  nm: "Line 4",
                  hd: false
                },
                {
                  ty: "st",
                  c: { a: 0, k: [0, 0.9, 0.9, 1], ix: 3 },
                  o: { a: 0, k: 80, ix: 4 },
                  w: { a: 0, k: 2, ix: 5 },
                  lc: 2,
                  lj: 2,
                  bm: 0,
                  nm: "Stroke 4",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transform"
                }
              ],
              nm: "Connection 4",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 8,
              hd: false
            },
            {
              ty: "gr",
              it: [
                {
                  ty: "sh",
                  d: 1,
                  ks: {
                    a: 0,
                    k: {
                      c: false,
                      v: [
                        [0, -40],
                        [0, 40]
                      ],
                      i: [
                        [0, 0],
                        [0, 0]
                      ],
                      o: [
                        [0, 0],
                        [0, 0]
                      ]
                    },
                    ix: 2
                  },
                  nm: "Line 5",
                  hd: false
                },
                {
                  ty: "st",
                  c: { a: 0, k: [0, 0.9, 0.9, 1], ix: 3 },
                  o: { a: 0, k: 80, ix: 4 },
                  w: { a: 0, k: 2, ix: 5 },
                  lc: 2,
                  lj: 2,
                  bm: 0,
                  nm: "Stroke 5",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transform"
                }
              ],
              nm: "Connection 5",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 9,
              hd: false
            },
            {
              ty: "gr",
              it: [
                {
                  ty: "sh",
                  d: 1,
                  ks: {
                    a: 0,
                    k: {
                      c: false,
                      v: [
                        [-40, 0],
                        [40, 0]
                      ],
                      i: [
                        [0, 0],
                        [0, 0]
                      ],
                      o: [
                        [0, 0],
                        [0, 0]
                      ]
                    },
                    ix: 2
                  },
                  nm: "Line 6",
                  hd: false
                },
                {
                  ty: "st",
                  c: { a: 0, k: [0, 0.9, 0.9, 1], ix: 3 },
                  o: { a: 0, k: 80, ix: 4 },
                  w: { a: 0, k: 2, ix: 5 },
                  lc: 2,
                  lj: 2,
                  bm: 0,
                  nm: "Stroke 6",
                  hd: false
                },
                {
                  ty: "tr",
                  p: { a: 0, k: [0, 0], ix: 2 },
                  a: { a: 0, k: [0, 0], ix: 1 },
                  s: { a: 0, k: [100, 100], ix: 3 },
                  r: { a: 0, k: 0, ix: 6 },
                  o: { a: 0, k: 100, ix: 7 },
                  sk: { a: 0, k: 0, ix: 4 },
                  sa: { a: 0, k: 0, ix: 5 },
                  nm: "Transform"
                }
              ],
              nm: "Connection 6",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 10,
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Network",
          np: 10,
          cix: 2,
          bm: 0,
          ix: 1,
          hd: false
        }
      ],
      ip: 0,
      op: 180,
      st: 0,
      bm: 0
    }
  ],
  markers: []
};

interface AutoTradeAnimationProps {
  className?: string;
}

const AutoTradeAnimation: React.FC<AutoTradeAnimationProps> = ({ className = '' }) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <Lottie
        animationData={autoTradeAnimationData}
        loop={true}
        autoplay={true}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default AutoTradeAnimation;