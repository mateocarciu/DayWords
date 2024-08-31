<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SseController extends Controller
{
    public function stream()
    {
        return response()->stream(function () {
            // Headers SSE
            set_time_limit(0);
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            header('Connection: keep-alive');

            // Simuler l'envoi de nouvelles données toutes les 5 secondes
            while (true) {
                // Par exemple, vous pourriez récupérer les dernières entrées ici
                $data = [
                    'message' => 'New update',
                    'timestamp' => now()->toDateTimeString()
                ];

                // Envoyer les données au client
                echo "data: " . json_encode($data) . "\n\n";

                // Forcer l'envoi des données
                ob_flush();
                flush();

                // Attendre avant d'envoyer la prochaine mise à jour
                sleep(5);
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
        ]);
    }
}