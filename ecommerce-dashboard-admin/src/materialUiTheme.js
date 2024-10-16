import { Token } from "@mui/icons-material";

export const tokensLight = {
  grey: {
    50: '#D3D3D3',
    100: '#EEF2F6',
  
    300: '#CDD5DF',
    500: '#697586',
    600: '#4B5565',
    700: '#364152',
    800: '#121926',
  },
  primary: {
    100: "#e3f2fd",
    200: "#bbdefb",
    300: "#90caf9",
    400: "#64b5f6",
    500: "#42a5f5",
    600: "#2296f3",
    700: "#2088e5",
    800: "#1b76d2",
    900: "#1765c0",
  },
  secondary: {
    100: "#ede7f6",
    200: "#d1c4e9",
    300: "#b39ddb",
    400: "#9575cd",
    500: "#7e57c2",
    600: "#673ab7",
    700: "#5e35b1",
    800: "#512da8",
    900: "#4527a0",
  },
  darkBlue: {
    100: "#ccd3da",
    200: "#99a6b5",
    300: "#667a91",
    400: "#334d6c",
    500: "#002147",
    600: "#001a39",
    700: "#00142b",
    800: "#000d1c",
    900: "#00070e",
  },
  darkBlack: {
      100: "#cdcccc",
      200: "#9b9a99",
      300: "#686766",
      400: "#363533",
      500: "#040200",
      600: "#030200",
      700: "#020100",
      800: "#020100",
      900: "#010000"
},
info:{
  50: '#D0F2FF',
  100: '#74CAFF',
  200: '#1890FF',
  300: '#0C53B7',
  400: '#04297A',
  500: '#fff',
},
success:{
  50: '#E9FCD4',
  100: '#AAF27F',
  200: '#54D62C',
  300: '#229A16',
  400: '#08660D'
},
warning:{
  50: '#FFF7CD',
  100: '#FFE16A',
  200: '#FFC107',
  300: '#B78103',
  400: '#7A4F01',
  
},
error:{
  50: '#FFE7D9',
  100: '#FFA48D',
  200: '#FF4842',
  300: '#B72136',
  400: '#7A0C2E',
  500: '#fff',
},
blue:{
  50: '#eef2f6',
100: '#2196f3',
200: '#1e88e5',
300: '#90caf9',
400: '#1565c0'
},
purple:{
  50: '#ede7f6',
  100: '#673ab7',
  200: '#5e35b1',
  300: '#b39ddb',
  400: '#4527a0'
},
orange:{
  100: '#fbe9e7',
  200: '#ffab91',
  300: '#d84315',
},
green:{
  100:'#198450',
  200:'#27a567',
  300:'#2eb774',
  400:'#38cb82',
  500:'#41dc8e',
  600:'#64e3a1'
}
};

function reverseTokens(tokensLight) {
  const reversedTokens = {};
  Object.entries(tokensLight).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}

export const tokensDark = reverseTokens(tokensLight)

export const themeSettings = (mode)=>{
  return {
    palette:{
      mode:mode,
      ...(mode === 'light' ? {
        primary:{
          ...tokensLight.primary,
          main:tokensLight.grey[100],
          light:tokensLight.grey[900],
          iconcolor:tokensLight.grey[800],
          iconcolor2:tokensLight.grey[500],
          textcolor:tokensLight.grey[700],
          bordercolor:tokensLight.grey[50]
        },
        secondary:{
          ...tokensLight.secondary,
          light:tokensLight.secondary[100],
          main:tokensLight.secondary[100],
          dark:tokensLight.secondary[700]
        },
        
        info:{
          ...tokensLight.info,
          main:tokensLight.info[300],
          dark:tokensLight.info[400]
        },
        error:{
          ...tokensLight.error,
          main:tokensLight.error[300]
        },
        success:{
          ...tokensLight.success,
          main:tokensLight.success[300]

        },
        warning:{
          ...tokensLight.warning,
          main:tokensLight.warning[300]
        },
        tertiary:{
          ...tokensLight.darkBlack,
          dark:tokensLight.darkBlack[900],
          medium:tokensLight.grey[400],
          textcolor:tokensDark.grey[200]
        },
        blue:{
          ...tokensLight.blue,
        },
        purple:{
          ...tokensLight.purple
        },
        orange:{
          ...tokensLight.orange,
          main:tokensLight.orange[200],
          light:tokensLight.orange[100],
          dark:tokensLight.orange[300]
        },
        green:{
          ...tokensLight.green,
          main:tokensLight.green[200],
          light:tokensLight.green[100]
        },

       
        background:{
          default:tokensLight.grey[200],
          alt:tokensLight.secondary[800],
          primary:tokensLight.darkBlue[400],
          sidebar:tokensLight.darkBlue[400],
          table:tokensLight.secondary[700],
          white:'#ffffff'

        }

      }:{
        primary:{
          ...tokensDark.primary,
          main:tokensDark.grey[700],
          iconcolor:tokensLight.grey[900],
          textcolor:tokensLight.grey[500]
          
        },
        secondary:{
          ...tokensDark.secondary,
          main:tokensLight.secondary[200],
          dark:tokensLight.grey[900]

        },
        tertiary:{
          ...tokensDark.darkBlack,
          dark:tokensDark.darkBlack[900],
          medium:tokensDark.grey[700],
          textcolor:tokensDark.darkBlack[100]
        },
        green:{
          ...tokensLight.green,
          main:tokensLight.green[500],
          light:tokensLight.green[400]
        },
        background:{

          default:tokensDark.darkBlue[100],
          alt:tokensDark.darkBlack[200],
          main:tokensDark.darkBlue[100],
          table:tokensDark.darkBlack[200],
          white:tokensLight.darkBlack[600]
        }

      }),
    },
    overriders:{
      MuiMenu:{
        list:{
          backgroundColor:'red'
        }
      },
      MuiMenuItem:{
        root:{
          fontSize:10
        }
      }

    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      h6: {
        fontWeight: 500,
        color: '#121926',
        fontSize: '0.75rem'
    },
    h5: {
        fontSize: '0.875rem',
        color: '#121926',
        fontWeight: 500
    },
    h4: {
        fontSize: '1rem',
        color: '#121926',
        fontWeight: 600
    },
    h3: {
        fontSize: '1.25rem',
        color: '#121926',
        fontWeight: 600
    },
    h2: {
        fontSize: '1.5rem',
        color: '#121926',
        fontWeight: 700
    },
    h1: {
        fontSize: '2.125rem',
        color: '#121926',
        fontWeight: 700
    },
    subtitle1: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#121926'
    },
    subtitle2: {
        fontSize: '0.75rem',
        fontWeight: 400,
        color: '#121926'
    },
    caption: {
        fontSize: '0.75rem',
        color: '#121926',
        fontWeight: 400
    },
    body1: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: '1.334em'
    },
    body2: {
        letterSpacing: '0em',
        fontWeight: 400,
        lineHeight: '1.5em',
        color: '#bdc8f0'
    },
    button: {
        textTransform: 'capitalize'
    },
    customInput: {
        marginTop: 1,
        marginBottom: 1,
        '& > label': {
            top: 23,
            left: 0,
            color: '#697586',
            '&[data-shrink="false"]': {
                top: 5
            }
        },
        '& > div > input': {
            padding: '30.5px 14px 11.5px !important'
        },
        '& legend': {
            display: 'none'
        },
        '& fieldset': {
            top: 0
        }
    },
    mainContent: {
        backgroundColor: '#EEF2F6',
        width: '100%',
        minHeight: 'calc(100vh - 88px)',
        flexGrow: 1,
        padding: '20px',
        marginTop: '88px',
        marginRight: '20px',
        borderRadius:'10px'
       
    },
    menuCaption: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#121926',
        padding: '6px',
        textTransform: 'capitalize',
        marginTop: '10px'
    },
    subMenuCaption: {
        fontSize: '0.6875rem',
        fontWeight: 500,
        color: '#697586',
        textTransform: 'capitalize'
    },
    commonAvatar: {
        cursor: 'pointer',
        borderRadius: '8px'
    },
    smallAvatar: {
        width: '22px',
        height: '22px',
        fontSize: '1rem'
    },
    mediumAvatar: {
        width: '34px',
        height: '34px',
        fontSize: '1.2rem'
    },
    largeAvatar: {
        width: '44px',
        height: '44px',
        fontSize: '1.5rem'
    }
    },
  //   components: {
  //     MuiInputBase: {
  //         styleOverrides: {
  //             input: {
  //                 color: 'blue',
                
  //                 // '&::before': {
  //                 //     border-bottom: 1px solid rgba(0, 0, 0, 0.42); // use your color
  //                 // }
  //             }
  //         }
  //     }
   
  
  // }

  }
}