\---

title: Chain Carousel

description: A horizontally scrolling carousel component for displaying blockchain chains, tokens, or custom items. It features auto-scroll with smooth Framer Motion animations, center highlighting, left/right mirrored displays, and an interactive search dropdown for selecting and focusing on specific items. Perfect for dashboards, explorers, and interactive listings.

\---



<ComponentPreview name="chain-carousel-demo" />



\## Installation



<Tabs defaultValue="cli">



<TabsList>

&#x20; <TabsTrigger value="cli">CLI</TabsTrigger>

&#x20; <TabsTrigger value="manual">Manual</TabsTrigger>

</TabsList>

<TabsContent value="cli">



```bash

npx lightswind@latest add chain-carousel

```



</TabsContent>



<TabsContent value="manual">



<Steps>



<Step>Copy and paste the following code into your project.</Step>



```tsx

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { motion, useInView } from 'framer-motion';

import {

&#x20;   LucideIcon,

&#x20;   TrendingUp, // Generic icon for fallback

&#x20;   Search,

&#x20;   DeleteIcon,

} from 'lucide-react';



// NOTE: Placeholder for your custom Input component

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (

&#x20;   <input {...props} />

);



// --- Core Data Interface ---

export interface ChainItem {

&#x20;   id: string | number; // Unique ID

&#x20;   name: string;

&#x20;   icon: LucideIcon;

&#x20;   /\*\* A secondary string line for the item, e.g., a short description or a value. \*/

&#x20;   details?: string;

&#x20;   logo?: string; // Optional image URL

}



// --- Internal Animated Type ---

/\*\* The specific type returned by getVisibleItems, extending the base ChainItem. \*/

type AnimatedChainItem = ChainItem \& {

&#x20;   distanceFromCenter: number;

&#x20;   originalIndex: number;

};



// --- Component Props Interfaces ---



interface CarouselItemProps {

&#x20;   chain: AnimatedChainItem;

&#x20;   side: 'left' | 'right';

}



interface ChainCarouselProps {

&#x20;   /\*\* The list of items to display in the carousel. (REQUIRED) \*/

&#x20;   items: ChainItem\[];

&#x20;   /\*\* The speed of the auto-scroll rotation in milliseconds. \*/

&#x20;   scrollSpeedMs?: number;

&#x20;   /\*\* The number of carousel items visible at once (must be an odd number). \*/

&#x20;   visibleItemCount?: number;

&#x20;   /\*\* Custom class for the main container div. \*/

&#x20;   className?: string;

&#x20;   /\*\* Function to call when a chain is selected from the search dropdown. \*/

&#x20;   onChainSelect?: (chainId: ChainItem\['id'], chainName: string) => void;

}



// --- Helper Components ---



/\*\* A single item card for the carousel. \*/

const CarouselItemCard: React.FC<CarouselItemProps> = ({ chain, side }) => {

&#x20;   const { distanceFromCenter, id, name, details, logo, icon: FallbackIcon } = chain;

&#x20;   const distance = Math.abs(distanceFromCenter);

&#x20;   // Visual effects based on distance from the center (0)

&#x20;   const opacity = 1 - distance / 4;

&#x20;   const scale = 1 - distance \* 0.1;

&#x20;   const yOffset = distanceFromCenter \* 90;

&#x20;   const xOffset = side === 'left' ? -distance \* 50 : distance \* 50;



&#x20;   const IconOrLogo = (

&#x20;       <div className="rounded-full border border-muted-foreground/60 

&#x20;       dark:border-muted-foreground/40 p-2 bg-foreground">

&#x20;           {logo ? (

&#x20;               <img src={logo} alt={`${name} logo`} className="size-8 rounded-full object-cover" />

&#x20;           ) : (

&#x20;               <FallbackIcon className="size-8 text-background" />

&#x20;           )}

&#x20;       </div>

&#x20;   );



&#x20;   return (

&#x20;       <motion.div

&#x20;           key={id}

&#x20;           className={`absolute flex items-center gap-4 text-background  px-6 py-3 

&#x20;               ${side === 'left' ? 'flex-row-reverse' : 'flex-row'}`}

&#x20;           animate={{

&#x20;               opacity,

&#x20;               scale,

&#x20;               y: yOffset,

&#x20;               x: xOffset,

&#x20;           }}

&#x20;           transition={{ duration: 0.4, ease: 'easeInOut' }}

&#x20;       >

&#x20;           {IconOrLogo}



&#x20;           <div className={`flex flex-col mx-4 ${side === 'left' ? 'text-right' : 'text-left'}`}>

&#x20;               {/\* FIX: Added whitespace-nowrap to prevent the name from wrapping. \*/}

&#x20;               <span className="text-md lg:text-lg font-semibold text-foreground whitespace-nowrap">{name}</span>

&#x20;               {/\* Display generic details/description \*/}

&#x20;               <span className="text-xs lg:text-sm text-gray-500">{details}</span>

&#x20;           </div>

&#x20;       </motion.div>

&#x20;   );

};



// --- Main Component ---



const ChainCarousel: React.FC<ChainCarouselProps> = ({

&#x20;   items,



&#x20;   scrollSpeedMs = 1500,

&#x20;   visibleItemCount = 9,

&#x20;   className = '',

&#x20;   onChainSelect,

}) => {

&#x20;   const \[currentIndex, setCurrentIndex] = useState(0);

&#x20;   const \[isPaused, setIsPaused] = useState(false);

&#x20;   const \[searchTerm, setSearchTerm] = useState('');

&#x20;   const \[showDropdown, setShowDropdown] = useState(false);



&#x20;   // References for Framer Motion scroll-based animation

&#x20;   const rightSectionRef = useRef<HTMLDivElement>(null);

&#x20;   const isInView = useInView(rightSectionRef, { margin: '-100px 0px -100px 0px' });

&#x20;   const totalItems = items.length;



&#x20;   // 1. Auto-scroll effect

&#x20;   useEffect(() => {

&#x20;       if (isPaused || totalItems === 0) return;



&#x20;       const interval = setInterval(() => {

&#x20;           setCurrentIndex((prev) => (prev + 1) % totalItems);

&#x20;       }, scrollSpeedMs);



&#x20;       return () => clearInterval(interval);

&#x20;   }, \[isPaused, totalItems, scrollSpeedMs]);



&#x20;   // 2. Scroll listener to pause carousel on page scroll

&#x20;   useEffect(() => {

&#x20;       let timeoutId: NodeJS.Timeout;

&#x20;       const handleScroll = () => {

&#x20;           setIsPaused(true);

&#x20;           clearTimeout(timeoutId);

&#x20;           timeoutId = setTimeout(() => {

&#x20;               setIsPaused(false);

&#x20;           }, 500); // Resume auto-scroll after 500ms of no scrolling

&#x20;       };



&#x20;       window.addEventListener('scroll', handleScroll, { passive: true });

&#x20;       return () => {

&#x20;           window.removeEventListener('scroll', handleScroll);

&#x20;           clearTimeout(timeoutId);

&#x20;       };

&#x20;   }, \[]);





&#x20;   // Memoized function for carousel items

&#x20;   const getVisibleItems = useCallback(

&#x20;       (): AnimatedChainItem\[] => { // Explicitly define return type

&#x20;           const visibleItems: AnimatedChainItem\[] = \[];

&#x20;           if (totalItems === 0) return \[];



&#x20;           // Ensure visibleItemCount is an odd number for a clear center item

&#x20;           const itemsToShow = visibleItemCount % 2 === 0 ? visibleItemCount + 1 : visibleItemCount;

&#x20;           const half = Math.floor(itemsToShow / 2);



&#x20;           for (let i = -half; i <= half; i++) {

&#x20;               let index = currentIndex + i;

&#x20;               if (index < 0) index += totalItems;

&#x20;               if (index >= totalItems) index -= totalItems;



&#x20;               visibleItems.push({

&#x20;                   ...items\[index],

&#x20;                   originalIndex: index,

&#x20;                   distanceFromCenter: i,

&#x20;               });

&#x20;           }

&#x20;           return visibleItems;

&#x20;       },

&#x20;       \[currentIndex, items, totalItems, visibleItemCount]

&#x20;   );



&#x20;   // Filtered list for search dropdown

&#x20;   const filteredItems = useMemo(() => {

&#x20;       return items.filter((item) =>

&#x20;           item.name.toLowerCase().includes(searchTerm.toLowerCase())

&#x20;       );

&#x20;   }, \[items, searchTerm]);



&#x20;   // Handler for selecting an item from the dropdown

&#x20;   const handleSelectChain = (id: ChainItem\['id'], name: string) => {

&#x20;       const index = items.findIndex((c) => c.id === id);

&#x20;       if (index !== -1) {

&#x20;           setCurrentIndex(index); // Jump to the selected item

&#x20;           setIsPaused(true);       // Pause to highlight the selection

&#x20;           if (onChainSelect) {

&#x20;           }

&#x20;       }

&#x20;       setSearchTerm(name); // Set search term to the selected item's name

&#x20;       setShowDropdown(false);

&#x20;   };



&#x20;   // The current item displayed in the center

&#x20;   const currentItem = items\[currentIndex];



&#x20;   // --- JSX Render ---

&#x20;   return (

&#x20;       <div id='explore-section' className={` space-y-20

&#x20;           ${className}`}>

&#x20;           <div className='flex flex-col xl:flex-row 

&#x20;           max-w-7xl mx-auto px-4 md:px-8 gap-12 justify-center items-center'>





&#x20;               {/\* Left Section - Chain Carousel (Hidden on smaller screens) \*/}

&#x20;               <motion.div

&#x20;                   className="relative w-full max-w-md xl:max-w-2xl h-\[450px] 

&#x20;               flex items-center justify-center hidden xl:flex -left-14"

&#x20;                   onMouseEnter={() => !searchTerm \&\& setIsPaused(true)}

&#x20;                   onMouseLeave={() => !searchTerm \&\& setIsPaused(false)}

&#x20;                   initial={{ x: '-100%', opacity: 0 }}

&#x20;                   animate={isInView ? { x: 0, opacity: 1 } : {}}

&#x20;                   transition={{ type: 'spring', stiffness: 80, damping: 20, duration: 0.8 }}

&#x20;               >

&#x20;                   {/\* Fading overlay to mask items \*/}

&#x20;                   <div className="absolute inset-0 z-10 pointer-events-none">

&#x20;                       <div className="absolute top-0 h-1/4 w-full bg-transparent"></div>

&#x20;                       <div className="absolute bottom-0 h-1/4 w-full bg-transparent "></div>

&#x20;                   </div>



&#x20;                   {getVisibleItems().map((chain) => (

&#x20;                       <CarouselItemCard

&#x20;                           key={chain.id}

&#x20;                           chain={chain} // Renamed prop to 'chain' for this component's context

&#x20;                           side="left"

&#x20;                       />

&#x20;                   ))}

&#x20;               </motion.div>



&#x20;               {/\* Middle Section - Text and Search Input \*/}

&#x20;               <div className="flex flex-col text-center 2xl:text-center xl:text-center

&#x20;                gap-4 max-w-md">



&#x20;                   {/\* Currently Selected Item Display \*/}

&#x20;                   {currentItem \&\& (

&#x20;                       <div className="flex flex-col items-center justify-center gap-0 mt-4">

&#x20;                           <div className='p-2 bg-foreground rounded-full'>

&#x20;                               {currentItem.logo ? (

&#x20;                                   <img src={currentItem.logo} alt={`${currentItem.name} logo`} className="size-12 rounded-full object-cover" />

&#x20;                               ) : (

&#x20;                                   <currentItem.icon className="size-8 text-background" />

&#x20;                               )}

&#x20;                           </div>

&#x20;                           <h3 className="text-xl xl:text-2xl font-bold text-foreground mt-2">

&#x20;                               {currentItem.name}

&#x20;                           </h3>

&#x20;                           <p className="text-sm xl:text-lg text-gray-400">{currentItem.details || 'View Details'}</p>

&#x20;                       </div>

&#x20;                   )}



&#x20;                   {/\* Search Bar \*/}

&#x20;                   <div className="mt-6 relative max-w-lg mx-auto xl:mx-0">

&#x20;                       <div className="px-3 flex items-center relative">

&#x20;                           <Input

&#x20;                               type="text"

&#x20;                               value={searchTerm}

&#x20;                               placeholder="Search Items..."

&#x20;                               onChange={(e) => {

&#x20;                                   const val = e.target.value;

&#x20;                                   setSearchTerm(val);

&#x20;                                   setShowDropdown(val.length > 0);

&#x20;                                   if (val === '') setIsPaused(false);

&#x20;                               }}

&#x20;                               onFocus={() => {

&#x20;                                   if (searchTerm.length > 0) setShowDropdown(true);

&#x20;                                   setIsPaused(true);

&#x20;                               }}

&#x20;                               onBlur={() => {

&#x20;                                   // Wait briefly before hiding to allow click on dropdown item

&#x20;                                   setTimeout(() => setShowDropdown(false), 200);

&#x20;                               }}

&#x20;                               className="flex-grow outline-none text-foreground bg-background px-4 

&#x20;                           !placeholder-gray-800 text-lg rounded-full border-gray-500 pr-10 

&#x20;                           pl-10 py-2 cursor-pointer border"

&#x20;                           />

&#x20;                           <Search className="absolute text-foreground w-5 h-5 left-6 pointer-events-none" />

&#x20;                           {searchTerm \&\& (

&#x20;                               <button

&#x20;                                   onClick={() => {

&#x20;                                       setSearchTerm('');

&#x20;                                       setShowDropdown(false);

&#x20;                                       setIsPaused(false);

&#x20;                                   }}

&#x20;                                   className="absolute right-6 text-foreground hover:text-gray-300"

&#x20;                               >

&#x20;                                   <DeleteIcon />

&#x20;                               </button>

&#x20;                           )}

&#x20;                       </div>



&#x20;                       {/\* Dropdown for search results \*/}

&#x20;                       {showDropdown \&\& filteredItems.length > 0 \&\& (

&#x20;                           <div className="absolute left-0 right-0 mt-2 bg-background 

&#x20;                       rounded-lg border z-20 max-h-60 overflow-y-auto shadow-xl">

&#x20;                               {filteredItems.slice(0, 10).map((chain) => (

&#x20;                                   <div

&#x20;                                       key={chain.id}

&#x20;                                       // FIX: Use e.preventDefault() to stop browser's form validation/alert

&#x20;                                       onMouseDown={(e) => {

&#x20;                                           e.preventDefault();

&#x20;                                           handleSelectChain(chain.id, chain.name);

&#x20;                                       }}

&#x20;                                       className="flex items-center gap-3 px-4 py-3 cursor-pointer 

&#x20;                                   hover:bg-gray-100/10 transition-colors rounded-lg m-2"

&#x20;                                   >

&#x20;                                       {chain.logo ? (

&#x20;                                           <img src={chain.logo} alt={`${chain.name} logo`} className="size-6 rounded-full object-cover" />

&#x20;                                       ) : (

&#x20;                                           <chain.icon size={24} className="text-primary" />

&#x20;                                       )}

&#x20;                                       <span className="text-foreground font-medium">{chain.name}</span>

&#x20;                                       <span className="ml-auto text-sm text-gray-500">{chain.details}</span>

&#x20;                                   </div>

&#x20;                               ))}

&#x20;                           </div>

&#x20;                       )}

&#x20;                   </div>

&#x20;               </div>



&#x20;               {/\* Right Section - Chain Carousel \*/}

&#x20;               <motion.div

&#x20;                   ref={rightSectionRef}

&#x20;                   className="relative w-full max-w-md  xl:max-w-2xl h-\[450px] 

&#x20;               flex items-center justify-center -right-14"

&#x20;                   onMouseEnter={() => !searchTerm \&\& setIsPaused(true)}

&#x20;                   onMouseLeave={() => !searchTerm \&\& setIsPaused(false)}

&#x20;                   initial={{ x: '100%', opacity: 0 }}

&#x20;                   animate={isInView ? { x: 0, opacity: 1 } : {}}

&#x20;                   transition={{ type: 'spring', stiffness: 80, damping: 20, duration: 0.8 }}

&#x20;               >

&#x20;                   {/\* Fading overlay to mask items \*/}

&#x20;                   <div className="absolute inset-0 z-10 pointer-events-none">

&#x20;                       <div className="absolute top-0 h-1/4 w-full bg-transparent "></div>

&#x20;                       <div className="absolute bottom-0 h-1/4 w-full bg-transparent "></div>

&#x20;                   </div>



&#x20;                   {getVisibleItems().map((chain) => (

&#x20;                       <CarouselItemCard

&#x20;                           key={chain.id}

&#x20;                           chain={chain}

&#x20;                           side="right"

&#x20;                       />

&#x20;                   ))}

&#x20;               </motion.div>







&#x20;           </div>



&#x20;       </div >

&#x20;   );

};



export default ChainCarousel;

```



</Steps>



</TabsContent>



</Tabs>



\## Usage



```tsx

import ChainCarousel from "@/components/lightswind/chain-carousel";

```



```tsx

// 1. Default carousel with auto-scroll

<ChainCarousel items={chainsList} />



// 2. Custom visible items, scroll speed, and selection callback

<ChainCarousel

&#x20; items={chainsList}

&#x20; visibleItemCount={7}

&#x20; scrollSpeedMs={2000}

&#x20; onChainSelect={(id, name) => console.log("Selected:", id, name)}

/>

```



\## Props



| Prop | Type | Default | Description | Required |

| ---- | ---- | ------- | ----------- | -------- |

| `items` | `ChainItem\[]` | `-` | Array of items to display in the carousel. Each item must include `id`, `name`, and an icon, with optional `details` and `logo`. | Yes |

| `scrollSpeedMs` | `number` | `1500` | Time in milliseconds between auto-scroll steps. Controls the rotation speed of the carousel. | No |

| `visibleItemCount` | `number` | `9` | The number of carousel items visible at once. Should be an odd number to keep a center-focused item. | No |

| `className` | `string` | `-` | Optional custom class name for the main container div. | No |

| `onChainSelect` | `(chainId: ChainItem\['id'], chainName: string) => void` | `-` | Callback fired when a chain/item is selected from the search dropdown. Receives the item's ID and name. | No |

| `ChainItem (Type Definition)` | `{

&#x20; id: string | number;       // Unique identifier

&#x20; name: string;              // Display name

&#x20; icon: LucideIcon;          // Lucide icon component

&#x20; details?: string;          // Optional secondary line or description

&#x20; logo?: string;             // Optional image URL for the item

}` | `-` | Defines the structure for a single carousel item, including icon, optional details, and optional logo image. | Yes |



