<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function register(Request $request)
    {

        
        // Validation des champs du formulaire
        $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'profileImage' => 'nullable|string', // Si vous recevez l'image en tant que chaîne Base64
        ]);
    
        $profileImageUrl = null; // Initialisation de l'URL de l'image
        
        // Si l'image est présente dans la requête
        if ($request->profileImage != 'null') {
            // Extraire le type mime et les données encodées en base64
            $imageParts = explode(';base64,', $request->profileImage);
            if (count($imageParts) === 2) {
                $imageTypeAux = explode('image/', $imageParts[0]);
                $imageType = $imageTypeAux[1];
                $imageBase64 = base64_decode($imageParts[1]);
    
                // Créer un nom unique pour l'image
                $imageName = time() . '.' . $imageType;
    
                // Changer le répertoire de stockage vers 'public/profile_images'
                $filePath = 'public/profile_images/' . $imageName;

                // Sauvegarder l'image dans le système de fichiers public
                Storage::put($filePath, $imageBase64);

                // Générer l'URL publique de l'image
                $profileImageUrl = Storage::url($filePath);

            } else {
                return response()->json(['error' => 'Invalid image format.'], 422);
            }
        }

        // Créer l'utilisateur avec les informations
        User::create([
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // 'profileImageUrl' => $profileImageUrl ?? '/storage/profile_images/fakeuser.png',
            'profileImageUrl' => $profileImageUrl,

        ]);
    
        return response()->json(['message' => 'User registered successfully!'], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
    
        $token = $user->createToken('auth_token')->plainTextToken;

        // if ($user->profileImageUrl == null) {
        //     $user->profileImageUrl =  '/storage/profile_images/fakeuser.png';
        // }
    
        // Retourner le token ainsi que les informations de l'utilisateur
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }
}
