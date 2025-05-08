<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use setasign\Fpdi\Fpdi;

class PdfMergeController extends Controller
{
    public function merge(Request $request)
    {
        $request->validate([
            'documents.*' => 'required|file|mimes:pdf',
        ]);

        $pdf = new Fpdi();

        foreach ($request->file('documents') as $file) {
            $pageCount = $pdf->setSourceFile($file->getPathname());

            for ($i = 1; $i <= $pageCount; $i++) {
                $template = $pdf->importPage($i);
                $size = $pdf->getTemplateSize($template);
                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $pdf->useTemplate($template);
            }
        }

        $outputPath = storage_path('app/public/merged.pdf');
        $pdf->Output('F', $outputPath);

        return response()->download($outputPath)->deleteFileAfterSend(true);
    }
}
