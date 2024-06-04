'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Paintbrush } from 'lucide-react'
import { useMemo } from 'react'

export function GradientPicker({
    background,
    setBackground,
    withGradient = true,
    className,
}: {
    background: string
    setBackground: (background: string) => void
    withGradient?: boolean
    className?: string
}) {
    const solids = [
        '#000000',
        '#FFFFFF',
        '#e4e4e7',
        '#E2E2E2',
        '#ff75c3',
        '#ffa647',
        '#ffe83f',
        '#9fff5b',
        '#70e2ff',
        '#cd93ff',
        '#09203f',
        '#FF7F50',
        '#32CD32',
        '#00CED1',
        '#8A2BE2',
        '#FFD700',
        '#FF6347',
        '#7B68EE',
        '#20B2AA',
        '#FF4500',
        '#8B4513',
        '#48D1CC',
        '#C71585',
        '#808080',
        '#4682B4',
        '#228B22',
        '#800000',
        '#000080',
    ];

    const gradients = [
        'linear-gradient(to top left, #56CCF2, #2F80ED)',
        'linear-gradient(to top right, #56CCF2, #2F80ED)',
        'linear-gradient(to top left, #0f4392, #1458c0)',
        'linear-gradient(to top left, #A8E063, #56CCF2)',
        'linear-gradient(to top left, #4A00E0, #8E2DE2)',
        'linear-gradient(to top left, #FD746C, #FF9068)',
        'linear-gradient(to top left, #1CB5E0, #000851)',
        'linear-gradient(to top left, #2F80ED, #56CCF2)',
        'linear-gradient(to top left, #009FFF, #ec2F4B)',
        'linear-gradient(to top left, #A6FFCB, #12FF7E)',
        'linear-gradient(to top left, #3D7EAA, #FFE47A)',
        'linear-gradient(to top left, #2E3192, #1BFFFF)',
        'linear-gradient(to top left, #003366, #336699)',
        'linear-gradient(to top left, #B8B8D1, #766E7A)',
        'linear-gradient(to top left, #F0F0F0, #D4D3DD)',
        'linear-gradient(to top left, #E1E1E1, #B4B4B4)',
        'linear-gradient(to top left, #F4F4F4, #E3E3E3)',
        'linear-gradient(to top left, #F8F8F8, #C0C0C0)',
        'linear-gradient(to top left, #363537, #2D2C2C)',
        'linear-gradient(to top left, #292929, #191919)',
        'linear-gradient(to top left, #1A1A1A, #111111)',
        'linear-gradient(to top left, #2C3E50, #273746)',
        'linear-gradient(to top left, #34495E, #2C3E50)',
        'linear-gradient(to top left, #262626, #1A1A1A)',
    ];

    const defaultTab = useMemo(() => {
        if (background.includes('url')) return 'image'
        if (background.includes('gradient')) return 'gradient'
        return 'solid'
    }, [background])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-[220px] justify-start text-left font-normal',
                        !background && 'text-muted-foreground',
                        className
                    )}
                >
                    <div className="w-full flex items-center gap-2">
                        {background ? (
                            <div
                                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                                style={{ background }}
                            ></div>
                        ) : (
                            <Paintbrush className="h-4 w-4" />
                        )}
                        <div className="truncate flex-1">
                            {background ? background : 'Pick a color'}
                        </div>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="w-full mb-4">
                        <TabsTrigger className="flex-1" value="solid">
                            Solid
                        </TabsTrigger>
                        {withGradient &&
                            <TabsTrigger className="flex-1" value="gradient">
                                Gradient
                            </TabsTrigger>
                        }
                    </TabsList>

                    <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
                        {solids.map((s) => (
                            <div
                                key={s}
                                style={{ background: s }}
                                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                                onClick={() => setBackground(s)}
                            />
                        ))}
                    </TabsContent>

                    <TabsContent value="gradient" className="mt-0">
                        <div className="flex flex-wrap gap-1 mb-2">
                            {gradients.map((s) => (
                                <div
                                    key={s}
                                    style={{ background: s }}
                                    className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                                    onClick={() => setBackground(s)}
                                />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                <Input
                    id="custom"
                    value={background}
                    className="col-span-2 h-8 mt-4"
                    onChange={(e) => setBackground(e.currentTarget.value)}
                />
            </PopoverContent>
        </Popover>
    )
}
